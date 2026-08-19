export class AuthService {

  static headers() {

    const apiKey = process.env.REQRES_API_KEY;

    if (!apiKey) {
      throw new Error('REQRES_API_KEY is not defined in the environment');
    }

    return {
      'x-api-key': apiKey
    };

  }

}