require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
// const loadCSV = require('../data/load-csv');
const LogisticRegression = require('./logistic-regression');
const plot = require('node-remote-plot')
const _ = require('lodash')
const mnist = require('mnist-data')


const mnistData = mnist.training(0,60000)

const features = mnistData.images.values.map(image => _.flatMap(image))
const encodedLabels = mnistData.labels.values.map(label => {
    const row = new Array(10).fill(0)
    row[label] = 1
    return row
})

const regression = new LogisticRegression(features, encodedLabels, {
        learningRate: 1.5,
        iterations: 20,
        batchSize: 100
    })

regression.train()

const testMinstData = mnist.testing(0,100)
const testFeatures = testMinstData.images.values.map(image => _.flatMap(image))
const testEncodedLabels = testMinstData.labels.values.map(label => {
    const row = new Array(10).fill(0)
    row[label] = 1
    return row
})

const accuracy = regression.test(testFeatures, testEncodedLabels)
console.log('Accuracy is: ', accuracy)
// let {features, labels, testFeatures, testLabels} = loadCSV('../data/cars.csv', {
//     shuffle: true,
//     splitTest: 50,
//     dataColumns: ['horsepower','displacement','weight'],
//     labelColumns: ['mpg'],
//     converters: {
//         mpg: (value) => {
//             const mpg = parseFloat(value)
//             if(mpg < 15){
//                 return [1, 0, 0]
//             } else if(mpg < 30){
//                 return [0, 1, 0]
//             }else{
//                 return [0, 0, 1]
//             }
//         }
//     }
// })

// const regression = new LogisticRegression(features, _.flatMap(labels), {
//     learningRate: 0.5,
//     iterations: 100,
//     batchSize: 10
// })

// regression.train()
// console.log(regression.test(testFeatures, _.flatMap(testLabels)))