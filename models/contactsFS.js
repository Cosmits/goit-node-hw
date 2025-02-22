import fs from 'fs/promises'
import path from 'path'
import { v1 as uuidv1 } from 'uuid'

const contactsPath = path.resolve('models', 'contacts.json')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8')
  return JSON.parse(data)
}

const getContactById = async (id) => {
  const allContacts = await listContacts()
  const foundContact = allContacts?.find(el => el.id === id)
  return foundContact || null
}

const removeContact = async (id) => {
  const allContacts = await listContacts()
  const indexEl = allContacts.findIndex(el => el.id === id)

  if (indexEl === -1) return null

  const [result] = allContacts.splice(indexEl, 1)
  fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
  return result
}

const addContact = async (body) => {
  const { name, email, phone } = body

  const allContacts = await listContacts()

  const duplicateTrue = allContacts.some(
    el => el.email.toLowerCase().trim() === email.toLowerCase().trim() ||
      el.phone.toLowerCase().trim() === phone.toLowerCase().trim())
  if (duplicateTrue) return null

  const id = uuidv1()
  const newContact = { id, name, email, phone }

  allContacts.push(newContact)
  fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
  return newContact || null
}

const updateContact = async (id, body) => {
  const allContacts = await listContacts()
  const indexEl = allContacts.findIndex(el => el.id === id)

  if (indexEl === -1) return null

  const { name, email, phone } = body

  const duplicateTrue = allContacts.some(
    el => el.email.toLowerCase().trim() === email.toLowerCase().trim() ||
      el.phone.toLowerCase().trim() === phone.toLowerCase().trim())
  if (duplicateTrue) return null

  const newContact = { id, name, email, phone }

  allContacts.splice(indexEl, 1, newContact)
  fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
  return newContact
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
