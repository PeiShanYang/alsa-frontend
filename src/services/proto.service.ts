import { HelloRequest, HelloReply } from '../pb/helloworld_pb';
import { GreeterClient } from '../pb/HelloworldServiceClientPb';

export class ProtoService {
    static client: GreeterClient;

    static connect() {
        ProtoService.client = new GreeterClient('http://tw100104318:57510');
        if (ProtoService.client) console.log('connection success');
        else console.log('connection failed');
    }

    static async sayHello(name: string): Promise<string> {
        const request = new HelloRequest();
        request.setName(name);
        const res: HelloReply = await ProtoService.client.sayHello(request, {});
        console.log(res);
        return res.getMessage();
    }
}