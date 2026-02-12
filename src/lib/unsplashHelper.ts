// Helper for Unsplash image integration
// In production, this would use the actual Unsplash API

export const unsplash_tool = {
  search: async (query: string): Promise<string> => {
    // In a real implementation, this would call the Unsplash API
    // For demo purposes, we return placeholder images based on query
    
    const imageCategories: { [key: string]: string[] } = {
      nature: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      ],
      city: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
      ],
      food: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      ],
      people: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
        'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      ],
      travel: [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800',
      ],
      technology: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      ],
      art: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
        'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
      ],
      sports: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      ],
      default: [
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
        'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800',
        'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800',
      ],
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Match query to category
    const lowerQuery = query.toLowerCase();
    let category = 'default';

    for (const [key, value] of Object.entries(imageCategories)) {
      if (lowerQuery.includes(key)) {
        category = key;
        break;
      }
    }

    // Return random image from category
    const images = imageCategories[category];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  },
};

// Usage example:
// const imageUrl = await unsplash_tool.search('nature sunset');
