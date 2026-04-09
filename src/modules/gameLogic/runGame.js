export async function runGame(game, coordinateRetriever) {
    while (true) {
        console.log('waiting for click...');
        const coord = await coordinateRetriever();
        console.log(coord);
    }
}