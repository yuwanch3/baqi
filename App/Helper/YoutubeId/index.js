/**
 * Ambil ID video YouTube dari beberapa format tautan yang dipakai API.
 * Mengembalikan string kosong bila input kosong atau bukan tautan yang dikenal.
 */
const getYoutubeId = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const value = url.trim();
  if (value === '') {
    return '';
  }

  const patterns = [
    // https://youtu.be/VIDEO_ID?si=...
    /(?:https?:\/\/)?(?:www\.|m\.)?youtu\.be\/([^?&#/]+)/i,
    // https://www.youtube.com/watch?v=VIDEO_ID&si=...
    /[?&]v=([^?&#/]+)/i,
    // https://www.youtube.com/embed/VIDEO_ID?si=...
    // https://www.youtube.com/shorts/VIDEO_ID?si=...
    /(?:^|\/)(?:embed|shorts)\/([^?&#/]+)/i,
  ];

  for (let i = 0; i < patterns.length; i += 1) {
    const match = value.match(patterns[i]);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
};

export default getYoutubeId;
