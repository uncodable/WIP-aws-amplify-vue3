function GetUser(amplify: any) {
  return amplify.Auth.currentAuthenticatedUser()
    .then((user: any) => {
      return user ?? null;
    })
    .catch((e: string) => new Error(e));
}

export default GetUser;
