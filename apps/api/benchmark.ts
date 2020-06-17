// tslint:disable-next-line: no-implicit-dependencies
import Autocannon from 'autocannon';

const benchmark = async () => {
  // tslint:disable-next-line: no-magic-numbers
  for (let mutableI = 0; mutableI < 10; ++mutableI) {
    const result = await Autocannon({
      url: 'http://localhost:3002/questions',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`${mutableI}: ${result.requests.mean} requests per second`);
  }
  process.exit();
};

benchmark().catch((err) => {
  console.error(err);
  process.exit();
});
