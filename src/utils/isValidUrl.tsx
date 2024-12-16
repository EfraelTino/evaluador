const isValidUrl = (url: string): boolean => {
  const forbiddenDomains = [
    "facebook.com",
    "www.facebook.com",
    "instagram.com",
    "www.instagram.com",
    "twitter.com",
    "www.twitter.com",
    "linkedin.com",
    "www.linkedin.com",
    "youtube.com",
    "www.youtube.com",
    "tiktok.com",
    "www.tiktok.com",
    "snapchat.com",
    "www.snapchat.com",
  ];

  try {
    const parsedUrl = new URL(url);

    // Validar si el hostname coincide con alguna red social
    const isForbidden = forbiddenDomains.some(
      (domain) => parsedUrl.hostname === domain
    );

    if (isForbidden) return false;

    // Validar si es localhost o 127.0.0.1
    const isLocalhost =
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1" ||
      parsedUrl.hostname.includes("localhost");

    if (isLocalhost) return false;

    // Si cumple todas las condiciones, es una URL válida
    return true;
  } catch (error) {
    // La URL no es válida
    return false;
  }
};

export  default isValidUrl