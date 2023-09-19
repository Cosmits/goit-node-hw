import ContactsMongo from '../schemas/contactsMongo.js';

const listContacts = async (filterObject) => {
  return await ContactsMongo.find(filterObject, ).populate("owner");;
};

const getContactById = async (id) => {
  return await ContactsMongo.findOne({ _id: id });
};

const addContact = async ({ name, email, phone, favorite }) => {
  return ContactsMongo.create({ name, email, phone, favorite });
};

const updateContact = async (id, fields) => {
  return await ContactsMongo.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = async (id) => {
  return await ContactsMongo.findByIdAndRemove({ _id: id });
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};