class LocalStorageCRUD {
  // export default class LocalStorageCRUD {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.nameOfIndex = "lastIndex";
    this.data = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    localStorage.getItem(this.nameOfIndex) ||
      localStorage.setItem(this.nameOfIndex, "0");
  }
  getAll() {
    return this.data;
  }

  getById(id) {
    return this.data.find(contato => contato.id===id);
  }
  /**
   * @private
   */
  __updateIndex() {
    
    let lastIndex = parseInt(localStorage.getItem("lastIndex"));
    if (isNaN(lastIndex))
      lastIndex = Math.max(...this.data.map(item=>item.id));
    
    lastIndex += 1;
    localStorage.setItem(this.nameOfIndex, lastIndex.toString());
    return lastIndex;
  }

  create(contato) {    
    contato["id"] = this.__updateIndex();
    this.data.push(contato);
    this.saveData();
    return contato.id;
  }

  update(id, updatedContato) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updatedContato };
      this.saveData();
      return true;
    }
    return false;
  }

  delete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }
}
export default LocalStorageCRUD;
