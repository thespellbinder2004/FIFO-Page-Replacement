const outputArea = document.querySelector("#outputArea");
const referenceStringInput = document.querySelector("#referenceString");
const frameSizeInput = document.querySelector("#frameSizeInput");
const pageFaultsInput = document.querySelector("#pageFaults");

const length = 20 + Math.floor(Math.random() * 11); // 20 to 30 elements
let referenceString = Array.from({ length }, () =>
    Math.floor(Math.random() * 10)
);

console.log(referenceString);
referenceStringInput.value = referenceString.join(", ");

function generateMarkupFrame(arrValues, current_step, frameSize) {
    // Fill in empty slots with blank strings
    const paddedValues = [...arrValues];
    while (paddedValues.length < frameSize) {
        paddedValues.push("");
    }

    // Create the boxes markup
    const boxesMarkup = paddedValues
        .map(
            (val) => `
        <div class="w-14 h-14 border border-gray-300 bg-white rounded-md flex items-center justify-center text-lg font-semibold text-gray-800 mb-2 leading-none">
          ${val}
        </div>
      `
        )
        .join("");

    // Final markup
    const markup = `
    <div class="flex flex-col items-center bg-gray-100 p-3 rounded-lg shadow-md">
      ${boxesMarkup}
      <div class="text-sm mt-2 font-semibold text-blue-600">Step ${current_step}</div>
    </div>
  `;

    return markup;
}

function simulateFIFO(referenceString, frameSize) {
    let frames = [];
    let curFrame = [];
    let pageFaults = 0;

    referenceString.forEach((val, index) => {
        const inFrame = curFrame.includes(val);

        if (!inFrame) {
            if (curFrame.length < frameSize) {
                curFrame.push(val);
            } else {
                curFrame.shift();
                curFrame.push(val);
            }
            pageFaults++;
        }

        frames.push([...curFrame]);
    });

    return { frames, pageFaults };
}

function generateMarkup(arrFrames, frameSize) {
    let markup = ``;
    arrFrames.forEach((val, i) => {
        markup += generateMarkupFrame(val, i + 1, frameSize);
    });
    return markup;
}

function getMarkup(referenceString, frameSize) {
    const { frames, pageFaults } = simulateFIFO(referenceString, frameSize);
    const markup = generateMarkup(frames, frameSize);
    return { markup, pageFaults };
}

const btnSimulate = document.getElementById("simulateBtn");

btnSimulate.addEventListener("click", () => {
    const frameSize = parseInt(frameSizeInput.value);

    const { markup, pageFaults } = getMarkup(referenceString, frameSize);
    console.log(getMarkup(referenceString, frameSize));
    outputArea.innerHTML = markup;
    pageFaultsInput.innerHTML = `Page Faults: ${pageFaults}`;
});

const btnRandomize = document.getElementById("randomBtn");
btnRandomize.addEventListener("click", () => {
    referenceString = Array.from({ length }, () =>
        Math.floor(Math.random() * 10)
    );
    referenceStringInput.value = referenceString.join(", ");
});
