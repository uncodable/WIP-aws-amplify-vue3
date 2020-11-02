/* eslint-disable */
export const labelMap = {
  email: "Email",
  phone_number: "Phone Number",
  username: "Username"
};

export const composePhoneNumber = (countryCode, local_phone_number) => {
  return `+${countryCode}${local_phone_number.replace(/[-()]/g, "")}`;
};
