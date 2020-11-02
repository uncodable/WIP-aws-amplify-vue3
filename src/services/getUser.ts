function GetUser(amplify: any) {
  return amplify.Auth.currentAuthenticatedUser()
    .then((user: any) => {
      if (!user) {
        return null;
      }
      return user;
    })
    .catch((e: string) => new Error(e));
}

export default GetUser;
