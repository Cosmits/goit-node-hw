import ContactsMongo from '../schemas/contactsMongo.js';

const listContacts = async (filterObject, params) => {
  console.log("🚀 ~ file: contactsDB.js:6 ~ listContacts ~ filterObject:", filterObject)
  console.log("🚀 ~ file: contactsDB.js:5 ~ listContacts ~ params:", params)
  return await ContactsMongo.find(filterObject, '', params).populate('owner', 'email')
};

const getContactById = async (id) => {
  return await ContactsMongo.findOne({ _id: id });
};

const addContact = async ({ name, email, phone, favorite, owner }) => {
  return ContactsMongo.create({ name, email, phone, favorite, owner });
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