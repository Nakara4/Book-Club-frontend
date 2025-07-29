import React, { createContext, useContext, useState, useCallback } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
};

// Translation keys and default values
const translations = {
  en: {
    // Follow button labels
    'follow.button.follow': 'Follow',
    'follow.button.following': 'Following',
    'follow.button.unfollow': 'Unfollow',
    'follow.button.requested': 'Requested',
    'follow.loading.following': 'Following...',
    'follow.loading.unfollowing': 'Unfollowing...',
    
    // ARIA labels
    'follow.aria.follow': 'Follow user',
    'follow.aria.unfollow': 'Unfollow user',
    'follow.aria.following': 'Following user',
    'follow.aria.unfollowing': 'Unfollowing user',
    'follow.aria.requested': 'Follow request pending',
    
    // Toast messages
    'follow.toast.error.follow': 'Failed to follow user',
    'follow.toast.error.unfollow': 'Failed to unfollow user',
    'follow.toast.success.follow': 'Successfully followed user',
    'follow.toast.success.unfollow': 'Successfully unfollowed user',
    'follow.toast.retry': 'Retry',
    
    // Screen reader announcements
    'follow.announce.followed': 'You are now following this user',
    'follow.announce.unfollowed': 'You are no longer following this user',
    'follow.announce.follow_failed': 'Follow action failed',
    'follow.announce.unfollow_failed': 'Unfollow action failed',
  },
  es: {
    // Follow button labels
    'follow.button.follow': 'Seguir',
    'follow.button.following': 'Siguiendo',
    'follow.button.unfollow': 'Dejar de seguir',
    'follow.button.requested': 'Solicitado',
    'follow.loading.following': 'Siguiendo...',
    'follow.loading.unfollowing': 'Dejando de seguir...',
    
    // ARIA labels
    'follow.aria.follow': 'Seguir usuario',
    'follow.aria.unfollow': 'Dejar de seguir usuario',
    'follow.aria.following': 'Siguiendo usuario',
    'follow.aria.unfollowing': 'Dejando de seguir usuario',
    'follow.aria.requested': 'Solicitud de seguimiento pendiente',
    
    // Toast messages
    'follow.toast.error.follow': 'Error al seguir usuario',
    'follow.toast.error.unfollow': 'Error al dejar de seguir usuario',
    'follow.toast.success.follow': 'Usuario seguido exitosamente',
    'follow.toast.success.unfollow': 'Dejaste de seguir al usuario exitosamente',
    'follow.toast.retry': 'Reintentar',
    
    // Screen reader announcements
    'follow.announce.followed': 'Ahora sigues a este usuario',
    'follow.announce.unfollowed': 'Ya no sigues a este usuario',
    'follow.announce.follow_failed': 'Acción de seguir falló',
    'follow.announce.unfollow_failed': 'Acción de dejar de seguir falló',
  },
  fr: {
    // Follow button labels
    'follow.button.follow': 'Suivre',
    'follow.button.following': 'Suivi',
    'follow.button.unfollow': 'Ne plus suivre',
    'follow.button.requested': 'Demandé',
    'follow.loading.following': 'Suivi en cours...',
    'follow.loading.unfollowing': 'Arrêt du suivi...',
    
    // ARIA labels
    'follow.aria.follow': 'Suivre l\'utilisateur',
    'follow.aria.unfollow': 'Ne plus suivre l\'utilisateur',
    'follow.aria.following': 'Suivi de l\'utilisateur en cours',
    'follow.aria.unfollowing': 'Arrêt du suivi de l\'utilisateur',
    'follow.aria.requested': 'Demande de suivi en attente',
    
    // Toast messages
    'follow.toast.error.follow': 'Échec du suivi de l\'utilisateur',
    'follow.toast.error.unfollow': 'Échec de l\'arrêt du suivi',
    'follow.toast.success.follow': 'Utilisateur suivi avec succès',
    'follow.toast.success.unfollow': 'Arrêt du suivi réussi',
    'follow.toast.retry': 'Réessayer',
    
    // Screen reader announcements
    'follow.announce.followed': 'Vous suivez maintenant cet utilisateur',
    'follow.announce.unfollowed': 'Vous ne suivez plus cet utilisateur',
    'follow.announce.follow_failed': 'L\'action de suivi a échoué',
    'follow.announce.unfollow_failed': 'L\'action d\'arrêt du suivi a échoué',
  },
  de: {
    // Follow button labels
    'follow.button.follow': 'Folgen',
    'follow.button.following': 'Folge ich',
    'follow.button.unfollow': 'Entfolgen',
    'follow.button.requested': 'Angefragt',
    'follow.loading.following': 'Folge...',
    'follow.loading.unfollowing': 'Entfolge...',
    
    // ARIA labels
    'follow.aria.follow': 'Benutzer folgen',
    'follow.aria.unfollow': 'Benutzer entfolgen',
    'follow.aria.following': 'Folge Benutzer',
    'follow.aria.unfollowing': 'Entfolge Benutzer',
    'follow.aria.requested': 'Folge-Anfrage ausstehend',
    
    // Toast messages
    'follow.toast.error.follow': 'Fehler beim Folgen des Benutzers',
    'follow.toast.error.unfollow': 'Fehler beim Entfolgen des Benutzers',
    'follow.toast.success.follow': 'Benutzer erfolgreich gefolgt',
    'follow.toast.success.unfollow': 'Benutzer erfolgreich entfolgt',
    'follow.toast.retry': 'Wiederholen',
    
    // Screen reader announcements
    'follow.announce.followed': 'Sie folgen jetzt diesem Benutzer',
    'follow.announce.unfollowed': 'Sie folgen diesem Benutzer nicht mehr',
    'follow.announce.follow_failed': 'Folgen-Aktion fehlgeschlagen',
    'follow.announce.unfollow_failed': 'Entfolgen-Aktion fehlgeschlagen',
  },
};

// Create context
const I18nContext = createContext();

// I18n provider component
export const I18nProvider = ({ children, defaultLanguage = SUPPORTED_LANGUAGES.EN }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or use default
    const savedLanguage = localStorage.getItem('bookclub_language');
    return savedLanguage && Object.values(SUPPORTED_LANGUAGES).includes(savedLanguage) 
      ? savedLanguage 
      : defaultLanguage;
  });

  // Change language function
  const changeLanguage = useCallback((newLanguage) => {
    if (Object.values(SUPPORTED_LANGUAGES).includes(newLanguage)) {
      setCurrentLanguage(newLanguage);
      localStorage.setItem('bookclub_language', newLanguage);
    }
  }, []);

  // Translation function
  const t = useCallback((key, fallback = key) => {
    const languageTranslations = translations[currentLanguage] || translations[SUPPORTED_LANGUAGES.EN];
    return languageTranslations[key] || fallback;
  }, [currentLanguage]);

  // Check if translation exists
  const hasTranslation = useCallback((key) => {
    const languageTranslations = translations[currentLanguage] || translations[SUPPORTED_LANGUAGES.EN];
    return key in languageTranslations;
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    hasTranslation,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use translation
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

// Hook specifically for follow-related translations
export const useFollowTranslation = () => {
  const { t } = useTranslation();
  
  return {
    // Button labels
    followLabel: t('follow.button.follow'),
    followingLabel: t('follow.button.following'),
    unfollowLabel: t('follow.button.unfollow'),
    requestedLabel: t('follow.button.requested'),
    
    // Loading states
    followingLoadingLabel: t('follow.loading.following'),
    unfollowingLoadingLabel: t('follow.loading.unfollowing'),
    
    // ARIA labels
    followAriaLabel: t('follow.aria.follow'),
    unfollowAriaLabel: t('follow.aria.unfollow'),
    followingAriaLabel: t('follow.aria.following'),
    unfollowingAriaLabel: t('follow.aria.unfollowing'),
    requestedAriaLabel: t('follow.aria.requested'),
    
    // Toast messages
    followErrorMessage: t('follow.toast.error.follow'),
    unfollowErrorMessage: t('follow.toast.error.unfollow'),
    followSuccessMessage: t('follow.toast.success.follow'),
    unfollowSuccessMessage: t('follow.toast.success.unfollow'),
    retryLabel: t('follow.toast.retry'),
    
    // Screen reader announcements
    followedAnnouncement: t('follow.announce.followed'),
    unfollowedAnnouncement: t('follow.announce.unfollowed'),
    followFailedAnnouncement: t('follow.announce.follow_failed'),
    unfollowFailedAnnouncement: t('follow.announce.unfollow_failed'),
    
    // Raw translation function for custom keys
    t,
  };
};

export default I18nContext;
