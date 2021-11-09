/**
 * Custom type to define the structure of the error sent back by the api.
 * @param string status - failure status describing the type of exception
 * @param string message - message describing the exception
 * @param Object failures - failed validations (if any)
 */
export type ErrorPayload = {
  message: string;
  failures?: { field: string; message: string }[];
};
