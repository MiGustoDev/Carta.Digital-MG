// src/services/promotionsService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
  startAfter,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';

const COLLECTION = 'promotions';
const PAGE_SIZE = 10;

const LOCAL_STORAGE_KEY = 'site_promociones_data';

const getLocalPromotions = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing local promotions:', e);
    }
  }
  
  // Default list of 6 local promotion images
  const defaultPromotions = [
    {
      id: 'local-1',
      title: 'Promoción 1',
      description: 'Imagen de promoción 1',
      imageUrl: '/promociones/1.jpg',
      active: true,
      date: new Date(Date.now() - 0 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'local-2',
      title: 'Promoción 2',
      description: 'Imagen de promoción 2',
      imageUrl: '/promociones/2.jpg',
      active: true,
      date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'local-3',
      title: 'Promoción 3',
      description: 'Imagen de promoción 3',
      imageUrl: '/promociones/3.jpg',
      active: true,
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'local-4',
      title: 'Promoción 4',
      description: 'Imagen de promoción 4',
      imageUrl: '/promociones/4.jpg',
      active: true,
      date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'local-5',
      title: 'Promoción 5',
      description: 'Imagen de promoción 5',
      imageUrl: '/promociones/5.jpg',
      active: true,
      date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'local-6',
      title: 'Promoción 6',
      description: 'Imagen de promoción 6',
      imageUrl: '/promociones/6.jpg',
      active: true,
      date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPromotions));
  return defaultPromotions;
};

const saveLocalPromotions = (promotions) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(promotions));
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

export const getActivePromotions = async (lastDoc = null) => {
  if (!isFirebaseConfigured) {
    try {
      const allLocal = getLocalPromotions();
      const active = allLocal.filter(p => p.active);
      // Sort by date desc
      active.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const startIndex = lastDoc ? active.findIndex(p => p.id === lastDoc) + 1 : 0;
      
      if (startIndex < 0 || startIndex >= active.length) {
        return { promotions: [], lastVisible: null, hasMore: false, error: null };
      }
      
      const promotions = active.slice(startIndex, startIndex + PAGE_SIZE);
      const lastVisible = promotions[promotions.length - 1]?.id || null;
      const hasMore = startIndex + PAGE_SIZE < active.length;
      
      return { promotions, lastVisible, hasMore, error: null };
    } catch (error) {
      console.error('Error fetching local active promotions:', error);
      return { promotions: [], lastVisible: null, hasMore: false, error: 'Error al cargar las promociones locales.' };
    }
  }
  try {
    let q = query(
      collection(db, COLLECTION),
      where('active', '==', true),
      orderBy('date', 'desc'),
      limit(PAGE_SIZE)
    );

    if (lastDoc) {
      q = query(
        collection(db, COLLECTION),
        where('active', '==', true),
        orderBy('date', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(q);
    const promotions = snapshot.docs.map(docToPromotion);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === PAGE_SIZE;

    return { promotions, lastVisible, hasMore, error: null };
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return { promotions: [], lastVisible: null, hasMore: false, error: 'Error al cargar las promociones.' };
  }
};

export const getAllPromotions = async (filterStatus = 'all', sortOrder = 'newest') => {
  if (!isFirebaseConfigured) {
    try {
      let promotions = getLocalPromotions();
      
      if (filterStatus === 'active') {
        promotions = promotions.filter(p => p.active);
      } else if (filterStatus === 'inactive') {
        promotions = promotions.filter(p => !p.active);
      }
      
      const sortDir = sortOrder === 'newest' ? -1 : 1;
      promotions.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return (dateA - dateB) * sortDir;
      });
      
      return { promotions, error: null };
    } catch (error) {
      console.error('Error fetching all local promotions:', error);
      return { promotions: [], error: 'Error al cargar las promociones locales.' };
    }
  }
  try {
    let q;
    const sortDir = sortOrder === 'newest' ? 'desc' : 'asc';

    if (filterStatus === 'active') {
      q = query(
        collection(db, COLLECTION),
        where('active', '==', true),
        orderBy('date', sortDir)
      );
    } else if (filterStatus === 'inactive') {
      q = query(
        collection(db, COLLECTION),
        where('active', '==', false),
        orderBy('date', sortDir)
      );
    } else {
      q = query(
        collection(db, COLLECTION),
        orderBy('date', sortDir)
      );
    }

    const snapshot = await getDocs(q);
    const promotions = snapshot.docs.map(docToPromotion);
    return { promotions, error: null };
  } catch (error) {
    console.error('Error fetching all promotions:', error);
    return { promotions: [], error: 'Error al cargar las promociones.' };
  }
};

export const getPromotionById = async (id) => {
  if (!isFirebaseConfigured) {
    try {
      const promotions = getLocalPromotions();
      const promotion = promotions.find(p => p.id === id);
      if (!promotion) {
        return { promotion: null, error: 'Promoción no encontrada.' };
      }
      return { promotion, error: null };
    } catch (error) {
      return { promotion: null, error: 'Error al cargar la promoción.' };
    }
  }
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { promotion: null, error: 'Promoción no encontrada.' };
    }
    return { promotion: docToPromotion(docSnap), error: null };
  } catch (error) {
    return { promotion: null, error: 'Error al cargar la promoción.' };
  }
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createPromotion = async (data, imageFile, onProgress) => {
  if (!isFirebaseConfigured) {
    try {
      let imageUrl = data.imageUrl || '';
      
      if (imageFile) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }
      
      if (!imageUrl) return { promotion: null, error: 'Se requiere una imagen.' };
      
      const now = new Date().toISOString();
      const newPromotion = {
        id: `local-${Date.now()}`,
        title: data.title,
        description: data.description || '',
        imageUrl,
        imageStoragePath: '',
        date: data.date || new Date().toISOString().split('T')[0],
        active: data.active ?? true,
        createdAt: now,
        updatedAt: now,
      };
      
      const promotions = getLocalPromotions();
      promotions.unshift(newPromotion);
      saveLocalPromotions(promotions);
      
      return { promotion: newPromotion, error: null };
    } catch (error) {
      console.error('Error creating local promotion:', error);
      return { promotion: null, error: 'Error al crear la promoción local.' };
    }
  }
  try {
    let imageUrl = data.imageUrl || '';
    let imageStoragePath = '';

    if (imageFile) {
      const uploadResult = await uploadImage(imageFile, onProgress);
      if (uploadResult.error) return { promotion: null, error: uploadResult.error };
      imageUrl = uploadResult.url;
      imageStoragePath = uploadResult.path;
    }

    if (!imageUrl) return { promotion: null, error: 'Se requiere una imagen.' };

    const now = new Date().toISOString();
    const docData = {
      title: data.title,
      description: data.description || '',
      imageUrl,
      imageStoragePath,
      date: data.date,
      active: data.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION), docData);
    return { promotion: { id: docRef.id, ...docData }, error: null };
  } catch (error) {
    console.error('Error creating promotion:', error);
    return { promotion: null, error: 'Error al crear la promoción.' };
  }
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updatePromotion = async (id, data, imageFile, onProgress) => {
  if (!isFirebaseConfigured) {
    try {
      const promotions = getLocalPromotions();
      const index = promotions.findIndex(p => p.id === id);
      if (index === -1) return { error: 'Promoción no encontrada.' };
      
      let imageUrl = promotions[index].imageUrl;
      if (imageFile) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }
      
      promotions[index] = {
        ...promotions[index],
        title: data.title,
        description: data.description || '',
        imageUrl,
        date: data.date || new Date().toISOString().split('T')[0],
        active: data.active,
        updatedAt: new Date().toISOString(),
      };
      
      saveLocalPromotions(promotions);
      return { error: null };
    } catch (error) {
      console.error('Error updating local promotion:', error);
      return { error: 'Error al actualizar la promoción local.' };
    }
  }
  try {
    const { promotion: existing } = await getPromotionById(id);
    if (!existing) return { error: 'Promoción no encontrada.' };

    let imageUrl = existing.imageUrl;
    let imageStoragePath = existing.imageStoragePath || '';

    if (imageFile) {
      // Delete old image if exists
      if (existing.imageStoragePath) {
        await deleteImageFromStorage(existing.imageStoragePath);
      }
      const uploadResult = await uploadImage(imageFile, onProgress);
      if (uploadResult.error) return { error: uploadResult.error };
      imageUrl = uploadResult.url;
      imageStoragePath = uploadResult.path;
    }

    const docRef = doc(db, COLLECTION, id);
    const updates = {
      title: data.title,
      description: data.description || '',
      imageUrl,
      imageStoragePath,
      date: data.date,
      active: data.active,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updates);
    return { error: null };
  } catch (error) {
    console.error('Error updating promotion:', error);
    return { error: 'Error al actualizar la promoción.' };
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deletePromotion = async (id) => {
  if (!isFirebaseConfigured) {
    try {
      const promotions = getLocalPromotions();
      const updated = promotions.filter(p => p.id !== id);
      saveLocalPromotions(updated);
      return { error: null };
    } catch (error) {
      console.error('Error deleting local promotion:', error);
      return { error: 'Error al eliminar la promoción local.' };
    }
  }
  try {
    const { promotion } = await getPromotionById(id);
    if (promotion?.imageStoragePath) {
      await deleteImageFromStorage(promotion.imageStoragePath);
    }
    await deleteDoc(doc(db, COLLECTION, id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return { error: 'Error al eliminar la promoción.' };
  }
};

// ─── Image Upload ─────────────────────────────────────────────────────────────

export const uploadImage = (file, onProgress) => {
  if (!isFirebaseConfigured) {
    return Promise.resolve({ url: null, path: null, error: 'Firebase no está configurado.' });
  }
  return new Promise((resolve) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `promotions/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        resolve({ url: null, path: null, error: 'Error al subir la imagen.' });
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path: `promotions/${fileName}`, error: null });
        } catch {
          resolve({ url: null, path: null, error: 'Error al obtener la URL de la imagen.' });
        }
      }
    );
  });
};

const deleteImageFromStorage = async (path) => {
  if (!isFirebaseConfigured) return;
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    // Non-critical: log but don't fail the operation
    console.warn('Could not delete image from storage:', error);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docToPromotion = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || '',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    imageStoragePath: data.imageStoragePath || '',
    date: data.date || '',
    active: data.active ?? true,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
};
