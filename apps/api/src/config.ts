import { get } from 'env-var';

const port = get('PORT')
  .required()
  .asPortNumber();

export { port };
