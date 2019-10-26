export const checkPhoto = {
  data() {
    return {};
  },
  methods: {
    checkPhoto(url) {
      try {
        if (url.length > 0) {
          return url;
        }
      } catch (error) {
        return 'https://jamesriverdental.com/wp-content/uploads/2015/02/no-photo-male.jpg';
      }
    }
  }
};
