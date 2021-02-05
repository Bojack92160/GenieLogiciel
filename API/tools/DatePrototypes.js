
/** retourn un string assez cours pour + de visibilité-
 *
 */
 Date.prototype.getOKLMDate = function(){
   return this.getDate()+"/"+(this.getMonth()+1)+"/"+this.getUTCFullYear();
 }
