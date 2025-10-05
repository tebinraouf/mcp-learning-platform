#!/usr/bin/env node
/**
 * Content Validation Script
 *
 * Validates educational content for the MCP Learning Platform including:
 * - Quiz questions and answer correctness
 * - Concept relationships and dependencies
 * - Educational requirements (passing thresholds, estimated times)
 * - Content completeness and consistency
 */

import {
	getAllStages,
	getAllConcepts,
	getStage,
	getModule,
} from "../src/services/ContentService.js";

const VALIDATION_RULES = {
	MIN_MODULES_PER_STAGE: 3,
	MIN_QUIZ_QUESTIONS: 5,
	MIN_PASSING_THRESHOLD: 60,
	MAX_PASSING_THRESHOLD: 80,
	MIN_ESTIMATED_MINUTES: 5,
	MAX_ESTIMATED_MINUTES: 120,
	MIN_CONCEPTS: 20,
};

const errors = [];
const warnings = [];

function error(message) {
	errors.push(`❌ ERROR: ${message}`);
}

function warn(message) {
	warnings.push(`⚠️  WARNING: ${message}`);
}

function validateStages() {
	console.log("\n📚 Validating Stages...");
	const stages = getAllStages();

	if (stages.length !== 5) {
		error(`Expected 5 stages, found ${stages.length}`);
	}

	stages.forEach((stage, index) => {
		// Validate stage properties
		if (!stage.id) error(`Stage ${index} missing id`);
		if (!stage.title) error(`Stage ${stage.id} missing title`);
		if (!stage.description) error(`Stage ${stage.id} missing description`);
		if (!stage.sequenceOrder) error(`Stage ${stage.id} missing sequenceOrder`);

		// Validate estimated time
		if (
			!stage.estimatedMinutes ||
			stage.estimatedMinutes < VALIDATION_RULES.MIN_ESTIMATED_MINUTES
		) {
			warn(
				`Stage ${stage.id} has low estimated time: ${stage.estimatedMinutes}min`,
			);
		}
		if (stage.estimatedMinutes > VALIDATION_RULES.MAX_ESTIMATED_MINUTES) {
			warn(
				`Stage ${stage.id} has high estimated time: ${stage.estimatedMinutes}min`,
			);
		}

		// Validate objectives
		if (!stage.objectives || stage.objectives.length === 0) {
			error(`Stage ${stage.id} has no objectives`);
		}

		// Validate modules
		if (
			!stage.moduleIds ||
			stage.moduleIds.length < VALIDATION_RULES.MIN_MODULES_PER_STAGE
		) {
			warn(
				`Stage ${stage.id} has only ${stage.moduleIds?.length || 0} modules (recommended: ${VALIDATION_RULES.MIN_MODULES_PER_STAGE}+)`,
			);
		}

		// Validate quiz exists
		if (stage.quiz) {
			validateQuiz(stage.quiz, stage.id);
		} else {
			error(`Stage ${stage.id} missing quiz`);
		}
	});

	console.log(`✓ Validated ${stages.length} stages`);
}

function validateModules() {
	console.log("\n📖 Validating Modules...");
	const stages = getAllStages();
	let totalModules = 0;

	stages.forEach((stage) => {
		if (!stage.moduleIds) return;

		stage.moduleIds.forEach((moduleId) => {
			totalModules++;
			const module = getModule(moduleId);

			if (!module) {
				error(`Module ${moduleId} referenced in ${stage.id} not found`);
				return;
			}

			// Validate module properties
			if (!module.title) error(`Module ${moduleId} missing title`);
			if (!module.description) error(`Module ${moduleId} missing description`);
			if (!module.objectives || module.objectives.length === 0) {
				error(`Module ${moduleId} has no objectives`);
			}
			if (!module.content || module.content.length === 0) {
				error(`Module ${moduleId} has no content sections`);
			}

			// Validate estimated time
			if (!module.estimatedMinutes || module.estimatedMinutes < 5) {
				warn(
					`Module ${moduleId} has very short estimated time: ${module.estimatedMinutes}min`,
				);
			}

			// Validate content sections
			module.content?.forEach((section, idx) => {
				if (!section.title)
					error(`Module ${moduleId} section ${idx} missing title`);
				if (!section.body)
					error(`Module ${moduleId} section ${idx} missing body`);
			});

			// Validate related concepts
			if (module.relatedConcepts && module.relatedConcepts.length > 0) {
				const allConcepts = getAllConcepts();
				module.relatedConcepts.forEach((conceptId) => {
					if (!allConcepts.includes(conceptId)) {
						warn(`Module ${moduleId} references unknown concept: ${conceptId}`);
					}
				});
			}
		});
	});

	console.log(`✓ Validated ${totalModules} modules`);
}

function validateQuiz(quiz, stageId) {
	if (
		!quiz.questions ||
		quiz.questions.length < VALIDATION_RULES.MIN_QUIZ_QUESTIONS
	) {
		error(
			`Quiz for ${stageId} has only ${quiz.questions?.length || 0} questions (minimum: ${VALIDATION_RULES.MIN_QUIZ_QUESTIONS})`,
		);
	}

	if (quiz.passingThreshold < VALIDATION_RULES.MIN_PASSING_THRESHOLD) {
		warn(
			`Quiz for ${stageId} has low passing threshold: ${quiz.passingThreshold}%`,
		);
	}
	if (quiz.passingThreshold > VALIDATION_RULES.MAX_PASSING_THRESHOLD) {
		warn(
			`Quiz for ${stageId} has high passing threshold: ${quiz.passingThreshold}%`,
		);
	}

	quiz.questions?.forEach((question, idx) => {
		// Validate question structure
		if (!question.id) error(`Quiz ${stageId} question ${idx} missing id`);
		if (!question.question)
			error(`Quiz ${stageId} question ${idx} missing question text`);
		if (!question.options || question.options.length < 2) {
			error(`Quiz ${stageId} question ${idx} needs at least 2 options`);
		}
		if (typeof question.correctAnswer !== "number") {
			error(`Quiz ${stageId} question ${idx} missing correctAnswer`);
		}

		// Validate correct answer index
		if (question.options && question.correctAnswer >= question.options.length) {
			error(
				`Quiz ${stageId} question ${idx} correctAnswer index out of bounds`,
			);
		}

		// Validate explanation
		if (!question.explanation) {
			warn(`Quiz ${stageId} question ${idx} missing explanation`);
		}

		// Check for duplicate options
		if (question.options) {
			const uniqueOptions = new Set(question.options);
			if (uniqueOptions.size !== question.options.length) {
				warn(`Quiz ${stageId} question ${idx} has duplicate options`);
			}
		}
	});
}

function validateConcepts() {
	console.log("\n🧠 Validating Concepts...");
	const concepts = getAllConcepts();

	if (concepts.length < VALIDATION_RULES.MIN_CONCEPTS) {
		warn(
			`Only ${concepts.length} concepts defined (recommended: ${VALIDATION_RULES.MIN_CONCEPTS}+)`,
		);
	}

	// Concepts are returned as strings (concept IDs only)
	// Basic validation that we have concepts
	if (concepts.length === 0) {
		error("No concepts defined");
	}

	console.log(`✓ Validated ${concepts.length} concept IDs`);
}

function validateStageProgression() {
	console.log("\n📈 Validating Stage Progression...");
	const stages = getAllStages();

	// Verify sequence order
	const sortedStages = [...stages].sort(
		(a, b) => a.sequenceOrder - b.sequenceOrder,
	);
	sortedStages.forEach((stage, idx) => {
		if (stage.sequenceOrder !== idx + 1) {
			error(
				`Stage ${stage.id} has incorrect sequenceOrder: ${stage.sequenceOrder} (expected: ${idx + 1})`,
			);
		}
	});

	// Verify first stage is unlocked by default
	const firstStage = sortedStages[0];
	if (firstStage.id !== "foundations") {
		warn(
			`First stage should typically be 'foundations', found: ${firstStage.id}`,
		);
	}

	console.log("✓ Stage progression validated");
}

function validateEducationalRequirements() {
	console.log("\n🎓 Validating Educational Requirements...");
	const stages = getAllStages();

	let totalEstimatedMinutes = 0;
	let totalQuestions = 0;

	stages.forEach((stage) => {
		totalEstimatedMinutes += stage.estimatedMinutes || 0;
		totalQuestions += stage.quiz?.questions?.length || 0;
	});

	console.log(
		`   Total learning time: ${totalEstimatedMinutes} minutes (${(totalEstimatedMinutes / 60).toFixed(1)} hours)`,
	);
	console.log(`   Total quiz questions: ${totalQuestions}`);

	if (totalEstimatedMinutes < 60) {
		warn(
			"Total learning time is less than 1 hour - consider adding more content",
		);
	}
	if (totalQuestions < 25) {
		warn(
			"Less than 25 total quiz questions - consider adding more assessments",
		);
	}

	console.log("✓ Educational requirements checked");
}

function printResults() {
	console.log("\n" + "=".repeat(60));
	console.log("VALIDATION RESULTS");
	console.log("=".repeat(60));

	if (errors.length === 0 && warnings.length === 0) {
		console.log("\n✅ All validations passed! Content is ready.");
		return 0;
	}

	if (errors.length > 0) {
		console.log(`\n❌ ERRORS (${errors.length}):`);
		errors.forEach((err) => console.log(`  ${err}`));
	}

	if (warnings.length > 0) {
		console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
		warnings.forEach((warn) => console.log(`  ${warn}`));
	}

	console.log("\n" + "=".repeat(60));
	console.log(`Summary: ${errors.length} errors, ${warnings.length} warnings`);
	console.log("=".repeat(60) + "\n");

	return errors.length > 0 ? 1 : 0;
}

// Main execution
console.log("🔍 MCP Learning Platform - Content Validation");
console.log("=".repeat(60));

try {
	validateStages();
	validateModules();
	validateConcepts();
	validateStageProgression();
	validateEducationalRequirements();

	const exitCode = printResults();
	process.exit(exitCode);
} catch (err) {
	console.error("\n💥 Validation failed with error:");
	console.error(err);
	process.exit(2);
}
