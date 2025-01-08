require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('./load-csv');
const LinearRegression = require('./linear-regression')

let {features, labels, testFeatures, testLabels} = loadCSV('./cars.csv', {
    shuffle: true,
    splitTest: 50,
    dataColumns: ['horsepower'],
    labelColumns: ['mpg']
})

const regression = new LinearRegression(features, labels, {
    learningRate: 0.0001,
    iterations: 100
})

regression.train()
regression.test(testFeatures, testLabels)

// console.log('Updated value for m:', regression.weights.get(1,0), 'Updated value for b:', regression.weights.get(0,0))