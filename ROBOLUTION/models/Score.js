const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    eventInfo: {
        type: String,
        required: true
    },
    judgeInfo: {
        type: String,
        required: true
    },
    contestantType: {
        type: String,
        enum: ['team', 'individual'],
        required: true
    },
    contestantName: {
        type: String,
        required: true
    },
    scores: {
        design_score: {
            type: Number,
            required: true,
            min: 0,
            max: 20
        },
        programming_score: {
            type: Number,
            required: true,
            min: 0,
            max: 20
        },
        performance_score: {
            type: Number,
            required: true,
            min: 0,
            max: 25
        },
        presentation_score: {
            type: Number,
            required: true,
            min: 0,
            max: 15
        },
        teamwork_score: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },
        aesthetics_score: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        bonus_score: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }
    },
    totalScore: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Remove the unique index constraint that prevents multiple scores for the same event
// ScoreSchema.index({ eventInfo: 1, judgeInfo: 1 }, { unique: true });

module.exports = mongoose.model('Score', ScoreSchema); 