const tf = require('@tensorflow/tfjs')
const _ = require('lodash')

class LogisticRegression {
    constructor(features, labels, options) {
        this.features = this.processFeatures(features)
        this.labels = tf.tensor(labels)
        this.options = Object.assign({ learningRate: 0.1, iterations: 1000, decisionBoundary: 0.5 }, options)
        this.costHistory = []


        this.weights = tf.zeros([this.features.shape[1], this.labels.shape[1]])
    }

    gradientDescent(features, labels) {
        const currentGuesses = features.matMul(this.weights).softmax()
        const differences = currentGuesses.sub(labels)

        const slopes = features
            .transpose()
            .matMul(differences)
            .div(features.shape[0])

        this.weights = this.weights.sub(slopes.mul(this.options.learningRate))
    }

    train() {
        const batchQuantity = Math.floor(
            this.features.shape[0] / this.options.batchSize
        );

        for (let i = 0; i < this.options.iterations; i++) {
            for (let j = 0; j < batchQuantity; j++) {
                const startIndex = j * this.options.batchSize;
                const { batchSize } = this.options;

                const featureSlice = this.features.slice([startIndex, 0], [batchSize, -1])
                const labelSlice = this.labels.slice([startIndex, 0], [batchSize, -1])

                this.gradientDescent(featureSlice, labelSlice)

            }
            this.recordCost()
            this.updateLearningRate()
        }
    }

    predict(observations) {
        return this.processFeatures(observations).matMul(this.weights).softmax().argMax(1)
    }

    test(testFeatures, testLabels) {
        const predictions = this.predict(testFeatures)
        testLabels = tf.tensor(testLabels).argMax(1)

        const incorrect = predictions.notEqual(testLabels).sum().get()

        return (predictions.shape[0] - incorrect) / predictions.shape[0]
    }

    processFeatures(features) {
        features = tf.tensor(features)
        if (this.mean && this.variance) {
            features = features.sub(this.mean).div(this.variance.pow(0.5))
        } else {
            features = this.standardize(features)
        }
        features = tf.ones([features.shape[0], 1]).concat(features, 1)
        return features
    }
    // Standardization is a method of scaling data so that it has a mean of 0 and a standard deviation of 1
    standardize(features) {
        const { mean, variance } = tf.moments(features, 0)

        const filler =  variance.cast('bool').logicalNot().cast('float32')

        this.mean = mean
        this.variance = variance.add(filler)

        return features.sub(mean).div(this.variance.pow(0.5))
    }

    recordCost() {
        const guesses = this.features.matMul(this.weights).softmax()
        const termOne = this.labels.transpose().matMul(guesses.log())
        const termtwo = this.labels.mul(-1).add(1).transpose().matMul(guesses.mul(-1).add(1).log())

        const cost = termOne.add(termtwo).div(this.features.shape[0]).mul(-1).get(0, 0)

        this.costHistory.unshift(cost)
    }

    updateLearningRate() {
        if (this.costHistory.length < 2) {
            return;
        }
        if (this.costHistory[0] > this.costHistory[1]) {
            this.options.learningRate /= 2;
        } else {
            this.options.learningRate *= 1.05;
        }
    }
}

module.exports = LogisticRegression