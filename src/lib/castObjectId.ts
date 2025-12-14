import { ObjectId } from "mongodb";

export function castObjectId(id: string | ObjectId): ObjectId {
    return id instanceof ObjectId ? id : new ObjectId(id);
}
