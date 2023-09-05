import { Router } from 'express'
import ctrl from '../../controllers/contacts-controllers.js'
import { validateContacts } from '../../middleware/validation/index.js'
import validation from '../../schemas/contactsValidation.js'

const router = Router()

router.get('/', ctrl.getAllContacts)
router.get('/:contactId', ctrl.getContactsById)

router.delete('/:contactId', ctrl.deleteContactsById)

router.post('/', validateContacts(validation.schemaValidation), ctrl.createContact)

router.put('/:contactId', ctrl.updateContact)

router.patch('/:contactId/favorite', validateContacts(validation.updateFavoriteSchema), ctrl.updateStatusContact)

export default router
