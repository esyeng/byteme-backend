console.log("It's Buntime!!");

const runBun = async () => {
  let result;
  try {
    console.log("Bun in the oven...");
    result = await Bun.build({
      entrypoints: ['./server.ts'],
      outdir: './dist',
      target: 'bun',
      minify: {
        whitespace: true,
        identifiers: true,
        syntax: true,
      },
      external: ['axios']
    });
    if (result.success) {
      const artifact = result.outputs[0];
      console.log("We made a Bun!", artifact);
      return 1;
    }
  } catch (error) {
    if (result && !result.success) {
      console.error("Build failed");
      for (const message of result.logs) {
        // Bun will pretty print the message object
        console.error(message);
      }
    }
    console.log("The Bun got burned :(");
    console.log("Error: ", error);
    return 0;
  }
}

runBun();
