import { randomBytes, createHash } from "crypto";

interface Options {
  salt?: string,
  saltGenerator?( count?: number ): string,
  saltLength?: number,
  algorithm: string,
  encoding?: "hex" | "base64"
}

export default hash;

function hash( data: string, { salt, saltGenerator, saltLength, algorithm, encoding = "hex" }: Options ){
  if( !salt ){
    if( saltGenerator ){
      salt = saltGenerator( saltLength );
    } else {
      if( !saltLength || saltLength < 1 ){
        throw new TypeError( "Salt length must be setted and greater than 0" );
      }

      salt = randomBytes( saltLength ).toString( "hex" );
    }
  }

  const hash = createHash( algorithm ).update( `${data}${salt}` ).digest( encoding );

  return { hash, salt };
};