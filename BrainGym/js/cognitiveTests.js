// Brain Gym - Cognitive Tests Module
console.log('Cognitive Tests module loaded');

class StroopTest {
    constructor() {
        this.colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        this.colorWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
        this.currentTrial = 0;
        this.totalTrials = 20;
        this.score = 0;
        this.startTime = 0;
        this.responses = [];
        this.currentWord = '';
        this.currentColor = '';
        this.isRunning = false;
    }

    start() {
        this.currentTrial = 0;
        this.score = 0;
        this.responses = [];
        this.isRunning = true;
        this.showInstructions();
    }

    showInstructions() {
        const testArea = document.getElementById('test-area');
        testArea.innerHTML = `
            <div class="stroop-container">
                <h2>Stroop Test - "Color Clash"</h2>
                <div class="instructions">
                    <p>You will see color words displayed in different colors.</p>
                    <p><strong>Click the button that matches the COLOR of the text, not the word itself.</strong></p>
                    <p>For example: If you see <span style="color: red;">BLUE</span>, click RED (the color of the text).</p>
                    <p>Work as quickly and accurately as possible!</p>
                </div>
                <button class="start-test-btn" onclick="stroopTest.startTest()">Start Test</button>
            </div>
        `;
    }

    startTest() {
        this.nextTrial();
    }

    nextTrial() {
        if (this.currentTrial >= this.totalTrials) {
            this.endTest();
            return;
        }

        this.currentTrial++;
        this.generateTrial();
        this.startTime = Date.now();
        this.displayTrial();
    }

    generateTrial() {
        const wordIndex = Math.floor(Math.random() * this.colorWords.length);
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        
        this.currentWord = this.colorWords[wordIndex];
        this.currentColor = this.colors[colorIndex];
    }

    displayTrial() {
        const testArea = document.getElementById('test-area');
        testArea.innerHTML = `
            <div class="stroop-container">
                <div class="trial-info">
                    <span>Trial ${this.currentTrial}/${this.totalTrials}</span>
                    <span>Score: ${this.score}/${this.currentTrial - 1}</span>
                </div>
                <div class="stroop-word" style="color: ${this.currentColor}; font-size: 48px; font-weight: bold; margin: 40px 0;">
                    ${this.currentWord}
                </div>
                <div class="color-buttons">
                    ${this.colors.map(color => 
                        `<button class="color-btn" style="background-color: ${color};" onclick="stroopTest.selectColor('${color}')">${color.toUpperCase()}</button>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    selectColor(selectedColor) {
        if (!this.isRunning) return;
        
        const responseTime = Date.now() - this.startTime;
        const isCorrect = selectedColor === this.currentColor;
        
        if (isCorrect) {
            this.score++;
        }

        this.responses.push({
            trial: this.currentTrial,
            word: this.currentWord,
            color: this.currentColor,
            selected: selectedColor,
            correct: isCorrect,
            responseTime: responseTime
        });

        setTimeout(() => this.nextTrial(), 500);
    }

    endTest() {
        this.isRunning = false;
        const accuracy = Math.round((this.score / this.totalTrials) * 100);
        const avgResponseTime = Math.round(this.responses.reduce((sum, r) => sum + r.responseTime, 0) / this.responses.length);
        
        const testArea = document.getElementById('test-area');
        testArea.innerHTML = `
            <div class="stroop-container">
                <h2>Test Complete!</h2>
                <div class="results">
                    <div class="result-item">
                        <span class="result-label">Accuracy:</span>
                        <span class="result-value">${accuracy}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Correct Answers:</span>
                        <span class="result-value">${this.score}/${this.totalTrials}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Average Response Time:</span>
                        <span class="result-value">${avgResponseTime}ms</span>
                    </div>
                    <div class="performance-rating">
                        <h3>Performance: ${this.getPerformanceRating(accuracy, avgResponseTime)}</h3>
                    </div>
                </div>
                <button class="restart-btn" onclick="stroopTest.start()">Try Again</button>
                <button class="back-btn" onclick="showHomepage()">Back to Categories</button>
            </div>
        `;
    }

    getPerformanceRating(accuracy, avgTime) {
        if (accuracy >= 90 && avgTime < 1000) return "Excellent! 🏆";
        if (accuracy >= 80 && avgTime < 1200) return "Very Good! 🎯";
        if (accuracy >= 70 && avgTime < 1500) return "Good! 👍";
        if (accuracy >= 60) return "Fair - Keep Practicing! 📈";
        return "Needs Improvement - Try Again! 💪";
    }
}

const CognitiveTests = {
    stroop: {
        name: 'Stroop Test',
        description: 'Test cognitive inhibition and attention control',
        testInstance: new StroopTest()
    },
    
    nback: {
        name: 'N-Back Test', 
        description: 'Challenge working memory',
        // Implementation will be added later
    },
    
    cpt: {
        name: 'Continuous Performance Test',
        description: 'Maintain sustained attention',
        // Implementation will be added later
    }
};

// Global instance for easy access
const stroopTest = CognitiveTests.stroop.testInstance;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CognitiveTests;
}