export function createGameGrid() {
    const grid = document.querySelector('.game-grid');

    for (let i = 1; i <= 10; ++i) {
        for (let j = 'A'.charCodeAt(); j <= 'J'.charCodeAt(); ++j) {
            const div = document.createElement('div');
            div.dataset.coordinate = `${String.fromCharCode(j)}${i}`;
            grid.appendChild(div);
        }
    }
}