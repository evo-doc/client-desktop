module.exports = {
   trace(message) {
      console.log(message);
   },
   info(message) {
      console.log(message);
   },
   debug(message) {
      console.log(message);
   },
   warn(message) {
      console.warn(message);
   },
   error(message) {
      console.error(message);
   },

   group(id) {
      console.group(id);
   },
   groupEnd(id) {
      console.groupEnd(id);
   },
};
