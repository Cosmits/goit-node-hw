import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/userValidation.js";

const userValidate = validateBody(usersSchemas.userSignupValidation);

const userSubscriptionValidate = validateBody(usersSchemas.usersSubscriptionFieldSchema);

export default { userValidate, userSubscriptionValidate };