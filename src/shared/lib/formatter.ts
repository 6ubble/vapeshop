export const formatters = {
    price: formatPrice,
    date: formatDate,
    phone: formatPhoneNumber,
    
    rating: (rating: number): string => {
      return rating.toFixed(1);
    },
    
    fileSize: (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    compact: (num: number): string => {
      if (num < 1000) return num.toString();
      if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
      return (num / 1000000).toFixed(1) + 'M';
    }
  };
  