import { Quiz, RecentQuizSummary, QuizResult } from '@/types/quiz';

export const DEMO_LECTURE_TEXT = `
LECTURE NOTES: Introduction to Machine Learning & Neural Networks

1. Overfitting and Regularization Techniques
Overfitting occurs when a machine learning model learns the training data too well, including its noise and outliers, resulting in poor generalization to unseen test data.
Key techniques to mitigate overfitting:
- Dropout: Randomly deactivates a fraction of neurons (e.g., 20%-50%) during each training iteration. This prevents neurons from co-adapting and forces the network to learn robust distributed representations.
- L1/L2 Regularization: Adds penalty terms to the loss function. L1 (Lasso) promotes sparsity by driving weights to exactly zero, while L2 (Ridge/Weight Decay) penalizes large weight magnitudes.
- Early Stopping: Monitors validation loss during training and halts optimization once validation performance stops improving.
- Data Augmentation: Synthetically expands the dataset size by applying transformations like rotations, flips, and cropping.

2. Gradient Descent & Optimization Algorithms
Gradient Descent updates network parameters (weights and biases) in the opposite direction of the gradient of the loss function with respect to parameters.
- Learning Rate (\u03b1): Hyperparameter controlling the step size per iteration. If too high, optimization diverges; if too low, convergence is extremely slow.
- Stochastic Gradient Descent (SGD): Computes gradients on single samples or small mini-batches, introducing stochasticity that helps escape local minima.
- Adam Optimizer: Adaptive Moment Estimation combines advantages of AdaGrad and RMSProp by maintaining exponentially decaying averages of past gradients (first moment) and squared gradients (second moment).

3. Loss Functions & Evaluation Metrics
- Cross-Entropy Loss: standard loss function for classification tasks, measuring dissimilarity between predicted probability distributions and true categorical labels.
- Mean Squared Error (MSE): standard loss function for regression tasks, computing average squared difference between target and predicted values.
- Precision vs. Recall: Precision measures true positives over all positive predictions. Recall (sensitivity) measures true positives over total actual positive instances. F1-score harmonic mean balances both metrics.

4. Neural Network Architecture Fundamentals
- Activation Functions: Introduce non-linearity into neural networks. Common choices include ReLU (Rectified Linear Unit, f(x) = max(0, x)), Sigmoid (scales output to 0-1 range), and Softmax (normalizes layer output into probability distribution summing to 1).
- Backpropagation: Uses the calculus chain rule to efficiently calculate partial derivatives of the loss function with respect to weights across all network layers from output back to input.
`;

export const MOCK_RECENT_QUIZZES: RecentQuizSummary[] = [
  {
    id: 'demo-ml-101',
    title: 'Introduction to Machine Learning',
    date: '2026-09-27',
    questionCount: 10,
    scorePercentage: 80,
    difficulty: 'Medium',
    isDemo: true,
  },
  {
    id: 'demo-db-201',
    title: 'Database Normalization & BCNF',
    date: '2026-09-25',
    questionCount: 8,
    scorePercentage: 88,
    difficulty: 'Hard',
    isDemo: true,
  },
  {
    id: 'demo-os-301',
    title: 'Operating Systems: Threads & Memory',
    date: '2026-09-22',
    questionCount: 10,
    scorePercentage: 70,
    difficulty: 'Medium',
    isDemo: true,
  },
  {
    id: 'demo-net-401',
    title: 'Computer Networks: TCP/IP Stack',
    date: '2026-09-18',
    questionCount: 15,
    scorePercentage: 93,
    difficulty: 'Easy',
    isDemo: true,
  },
];

export const DEMO_QUIZ: Quiz = {
  id: 'demo-ml-101',
  title: 'Introduction to Machine Learning',
  createdAt: new Date().toISOString(),
  isDemo: true,
  sourceFilename: 'ML_Lecture_04_Overfitting_and_Optimization.pdf',
  extractedSnippet: 'Lecture notes covering overfitting, dropout, regularization, gradient descent, backpropagation, and loss functions.',
  config: {
    numberOfQuestions: 10,
    difficulty: 'Medium',
    questionTypes: ['mcq', 'short_answer'],
    focusTopic: 'Neural Networks & Overfitting',
  },
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      question: 'Which technique randomly deactivates a fraction of neurons during training to reduce overfitting in neural networks?',
      topic: 'Regularization',
      options: [
        'Batch Normalization',
        'Dropout',
        'Gradient Clipping',
        'Data Imputation'
      ],
      correctAnswer: 1,
      explanation: 'Dropout randomly deactivates a subset of neurons during training iterations, preventing co-adaptation of features and reducing overfitting.'
    },
    {
      id: 'q2',
      type: 'mcq',
      question: 'What is the primary effect of L1 (Lasso) regularization compared to L2 (Ridge) regularization?',
      topic: 'Regularization',
      options: [
        'It speeds up learning rate automatically',
        'It prevents exploding gradients',
        'It promotes model feature sparsity by driving some weights to exact zero',
        'It prevents division by zero in loss computation'
      ],
      correctAnswer: 2,
      explanation: 'L1 regularization adds the absolute value of coefficients as penalty terms, which naturally forces less important feature weights to exactly zero, creating sparse models.'
    },
    {
      id: 'q3',
      type: 'mcq',
      question: 'Which activation function outputs values in the range (0, 1) and is frequently used for binary classification output layers?',
      topic: 'Neural Networks',
      options: [
        'ReLU (Rectified Linear Unit)',
        'Sigmoid',
        'Leaky ReLU',
        'Hyperbolic Tangent (tanh)'
      ],
      correctAnswer: 1,
      explanation: 'The Sigmoid function maps real-valued numbers into the range (0, 1), making it ideal for predicting probabilities in binary classification.'
    },
    {
      id: 'q4',
      type: 'mcq',
      question: 'What optimization algorithm maintains exponentially decaying averages of both past gradients and squared gradients?',
      topic: 'Optimization',
      options: [
        'Stochastic Gradient Descent (SGD)',
        'AdaGrad',
        'Adam Optimizer',
        'RMSProp'
      ],
      correctAnswer: 2,
      explanation: 'Adam (Adaptive Moment Estimation) combines first moment (mean) and second moment (uncentered variance) estimates of past gradients.'
    },
    {
      id: 'q5',
      type: 'short_answer',
      question: 'Explain what happens during the Backpropagation algorithm in a neural network.',
      topic: 'Neural Networks',
      sampleAnswer: 'Backpropagation uses the calculus chain rule to calculate partial derivatives of the loss function with respect to weights across all network layers, propagating error backwards from output to input to update weights.',
      explanation: 'Backpropagation computes the loss gradient for each weight by applying the calculus chain rule layer by layer backwards from output to input.',
      keywords: ['chain rule', 'derivative', 'gradient', 'loss', 'weight update', 'error']
    },
    {
      id: 'q6',
      type: 'mcq',
      question: 'What hyperparameter controls the step size taken during weight updates in Gradient Descent?',
      topic: 'Optimization',
      options: [
        'Batch Size',
        'Learning Rate (\u03b1)',
        'Epoch Count',
        'Momentum Coefficient'
      ],
      correctAnswer: 1,
      explanation: 'The learning rate controls how large a step parameters take in the direction opposite to the gradient during optimization.'
    },
    {
      id: 'q7',
      type: 'mcq',
      question: 'Which loss function is standard for multi-class classification problems?',
      topic: 'Training',
      options: [
        'Mean Squared Error (MSE)',
        'Categorical Cross-Entropy',
        'Mean Absolute Error (MAE)',
        'Hinge Loss'
      ],
      correctAnswer: 1,
      explanation: 'Cross-Entropy measures dissimilarity between predicted probability distribution outputs and the true target one-hot labels.'
    },
    {
      id: 'q8',
      type: 'short_answer',
      question: 'Define Early Stopping and explain why it is useful.',
      topic: 'Regularization',
      sampleAnswer: 'Early Stopping is a technique where model validation loss is monitored during training, and training is halted as soon as validation loss begins to increase or plateau, preventing overfitting.',
      explanation: 'Early Stopping halts optimization when performance on a validation split begins to deteriorate, saving model weights at peak generalization performance.',
      keywords: ['validation loss', 'halt', 'stop', 'overfitting', 'monitor']
    },
    {
      id: 'q9',
      type: 'mcq',
      question: 'What is the mathematical definition of the ReLU activation function?',
      topic: 'Neural Networks',
      options: [
        'f(x) = 1 / (1 + e^-x)',
        'f(x) = max(0, x)',
        'f(x) = (e^x - e^-x) / (e^x + e^-x)',
        'f(x) = log(1 + e^x)'
      ],
      correctAnswer: 1,
      explanation: 'ReLU outputs zero for negative inputs and returns the input value directly for positive inputs: f(x) = max(0, x).'
    },
    {
      id: 'q10',
      type: 'mcq',
      question: 'If a classifier has high precision but low recall, what does this indicate?',
      topic: 'Training',
      options: [
        'It makes many false positive predictions',
        'When it predicts positive it is usually correct, but it misses many actual positive instances',
        'It predicts all positive instances correctly but makes zero negative predictions',
        'The dataset is completely balanced and noise-free'
      ],
      correctAnswer: 1,
      explanation: 'High precision means positive predictions are reliable (few false positives), while low recall means many actual positive cases were missed (high false negatives).'
    }
  ]
};

export const DEMO_SAMPLE_RESULT: QuizResult = {
  quizId: 'demo-ml-101',
  quizTitle: 'Introduction to Machine Learning',
  completedAt: new Date().toISOString(),
  timeTakenSeconds: 214, // 3 mins 34 secs
  totalQuestions: 10,
  correctAnswers: 8,
  incorrectAnswers: 2,
  unanswered: 0,
  percentage: 80,
  isDemo: true,
  topicPerformance: [
    { topic: 'Neural Networks', correct: 3, total: 3, percentage: 100 },
    { topic: 'Optimization', correct: 2, total: 2, percentage: 100 },
    { topic: 'Training', correct: 2, total: 2, percentage: 100 },
    { topic: 'Regularization', correct: 1, total: 3, percentage: 33 },
  ],
  aiStudyInsight: 'Great job scoring 80%! You demonstrated strong mastery over Neural Networks, Optimization, and Loss functions. However, you struggled with Regularization concepts (specifically L1 sparsity and Early Stopping details). We recommend reviewing L1 vs L2 penalty formulas and validation curve monitoring before your next exam.',
  results: [
    {
      questionId: 'q1',
      type: 'mcq',
      questionText: 'Which technique randomly deactivates a fraction of neurons during training to reduce overfitting in neural networks?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'Dropout randomly deactivates a subset of neurons during training iterations, preventing co-adaptation of features.',
      topic: 'Regularization'
    },
    {
      questionId: 'q2',
      type: 'mcq',
      questionText: 'What is the primary effect of L1 (Lasso) regularization compared to L2 (Ridge) regularization?',
      userAnswer: 0,
      correctAnswer: 2,
      isCorrect: false,
      explanation: 'L1 regularization adds the absolute value of coefficients as penalty terms, which forces feature weights to exact zero.',
      topic: 'Regularization'
    },
    {
      questionId: 'q3',
      type: 'mcq',
      questionText: 'Which activation function outputs values in the range (0, 1) and is frequently used for binary classification output layers?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'The Sigmoid function maps real-valued numbers into the range (0, 1).',
      topic: 'Neural Networks'
    },
    {
      questionId: 'q4',
      type: 'mcq',
      questionText: 'What optimization algorithm maintains exponentially decaying averages of both past gradients and squared gradients?',
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true,
      explanation: 'Adam combines first moment (mean) and second moment estimates of past gradients.',
      topic: 'Optimization'
    },
    {
      questionId: 'q5',
      type: 'short_answer',
      questionText: 'Explain what happens during the Backpropagation algorithm in a neural network.',
      userAnswer: 'Backpropagation calculates partial derivatives of the loss function using the calculus chain rule backwards from output layer to update network weights.',
      correctAnswer: 'Backpropagation uses the calculus chain rule to calculate partial derivatives of the loss function with respect to weights across all network layers.',
      isCorrect: true,
      explanation: 'Backpropagation computes the loss gradient for each weight by applying the calculus chain rule layer by layer backwards.',
      topic: 'Neural Networks',
      feedback: 'Excellent answer! You correctly referenced the calculus chain rule and backward loss gradient propagation.'
    },
    {
      questionId: 'q6',
      type: 'mcq',
      questionText: 'What hyperparameter controls the step size taken during weight updates in Gradient Descent?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'The learning rate controls how large a step parameters take in optimization.',
      topic: 'Optimization'
    },
    {
      questionId: 'q7',
      type: 'mcq',
      questionText: 'Which loss function is standard for multi-class classification problems?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'Cross-Entropy measures dissimilarity between predicted probability distribution outputs and true categorical labels.',
      topic: 'Training'
    },
    {
      questionId: 'q8',
      type: 'short_answer',
      questionText: 'Define Early Stopping and explain why it is useful.',
      userAnswer: 'It stops training when epoch count reaches 100.',
      correctAnswer: 'Early Stopping is a technique where model validation loss is monitored during training, and training is halted as soon as validation loss begins to increase.',
      isCorrect: false,
      explanation: 'Early Stopping halts optimization when performance on a validation split begins to deteriorate, saving model weights at peak generalization performance.',
      topic: 'Regularization',
      feedback: 'Incomplete. Early stopping relies on monitoring validation loss, not a fixed epoch limit.'
    },
    {
      questionId: 'q9',
      type: 'mcq',
      questionText: 'What is the mathematical definition of the ReLU activation function?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'ReLU outputs zero for negative inputs and returns the input value directly for positive inputs: f(x) = max(0, x).',
      topic: 'Neural Networks'
    },
    {
      questionId: 'q10',
      type: 'mcq',
      questionText: 'If a classifier has high precision but low recall, what does this indicate?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      explanation: 'High precision means positive predictions are reliable, while low recall means many actual positive cases were missed.',
      topic: 'Training'
    }
  ]
};
