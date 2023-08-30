import { Router } from 'express'
import contacts from '../../models/contacts.js'

import Joi from 'joi'
import JoiPhoneNumber from 'joi-phone-number';

const myJoi = Joi.extend(JoiPhoneNumber);

const schemaValidation = myJoi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  phone: myJoi.string().phoneNumber().required(),
});

const router = Router()

router.get('/', async (req, res, next) => {
  const contactList = await contacts.listContacts();

  if (!contactList) return res.status(404).json({
    status: 'Not Found',
    code: 404,
    message: 'Not found',
    data: contactList,
  })

  res.json({
    status: "OK",
    code: 200,
    data: contactList,
  });
})

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const currentContact = await contacts.getContactById(contactId);

  if (!currentContact) return res.status(404).json({
    status: 'Not Found',
    code: 404,
    message: 'Not found',
    data: currentContact,
  })

  res.json({
    status: "OK",
    code: 200,
    data: currentContact,
  });
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const currentContact = await contacts.removeContact(contactId);

  if (!currentContact) return res.status(404).json({
    status: 'Not Found',
    code: 404,
    message: 'Not found',
    data: currentContact,
  })

  res.json({
    status: "OK",
    code: 200,
    data: currentContact,
  });
})

router.post('/', async (req, res, next) => { 
  const { name, email, phone } = req.body;

  const { error } = schemaValidation.validate(req.body)

  if (error) return res.status(400).json({
    status: 'Not Found',
    code: 404,
    message: 'missing required name field',
    data: { name, email, phone },
  });

  const currentContact = await contacts.addContact({ name, email, phone });

  if (!currentContact) return res.status(404).json({
    status: 'Not Found',
    code: 404,
    message: 'Not found',
    data: currentContact,
  })
  
  res.json({
    status: "Created",
    code: 201,
    data: currentContact,
  });
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const { error } = schemaValidation.validate(req.body)

  if (error) return res.status(400).json({
    status: 'Not Found',
    code: 404,
    message: 'missing fields',
    data: { name, email, phone },
  });

  const currentContact = await contacts.updateContact(contactId,{ name, email, phone });

  if (!currentContact) return res.status(404).json({
    status: 'Not Found',
    code: 404,
    message: 'Not found',
    data: currentContact,
  })
  
  res.json({
    status: "OK",
    code: 200,
    data: currentContact,
  });
})

export default router
