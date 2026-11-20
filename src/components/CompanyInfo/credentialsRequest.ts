import { Map } from '../../types/Map.ts'
import { HttpBasicAuthenticationDetails, UpdateCredentialsRequest } from '../../types/Credential.ts'

/**
 * Builds the body for the create and edit credentials requests.
 * The backend reads the subtype of `details` from `details.type`, so the type is repeated there.
 */
export const buildCredentialsRequest = (formData: Map, ownerBusinessId: string): UpdateCredentialsRequest => {
  const details: HttpBasicAuthenticationDetails = {
    type: formData.type as string,
    userId: formData.details_userId as string,
    password: formData.details_password as string
  }

  return {
    name: formData.name as string,
    description: formData.description as string,
    type: formData.type as string,
    details: details,
    owner: ownerBusinessId,
    urlPattern: formData.urlPattern as string
  }
}
