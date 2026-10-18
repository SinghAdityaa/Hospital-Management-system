
import api from "./api";

export async function registerPatient(patientData) {
  const response = await api.post(
    "/api/auth/register",
    patientData
  );

  return response.data;
}
