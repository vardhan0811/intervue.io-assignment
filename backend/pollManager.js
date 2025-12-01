/**
 * Poll Manager - Business logic for poll management
 * Handles poll creation, answer submission, results calculation, and history
 */

class PollManager {
  constructor() {
    this.currentPoll = null;
    this.pollHistory = [];
    this.students = new Map(); // socketId -> { name, hasAnswered, answer }
    this.pollTimer = null;
  }

  /**
   * Create a new poll
   */
  createPoll(pollData) {
    const { question, options, correctAnswer, timeLimit = 60 } = pollData;

    // Validate poll data
    if (!question || !options || options.length !== 4) {
      throw new Error('Invalid poll data: question and 4 options required');
    }

    if (correctAnswer < 0 || correctAnswer >= 4) {
      throw new Error('Invalid correct answer index');
    }

    // Check if previous poll is complete
    if (this.currentPoll && !this.isPollComplete()) {
      throw new Error('Cannot create new poll: previous poll is still active');
    }

    // Reset student answers
    this.students.forEach(student => {
      student.hasAnswered = false;
      student.answer = null;
    });

    // Create new poll
    this.currentPoll = {
      id: Date.now(),
      question,
      options: options.map((text, index) => ({
        text,
        index,
        votes: 0,
        isCorrect: index === correctAnswer
      })),
      correctAnswer,
      timeLimit,
      startTime: Date.now(),
      endTime: null,
      isActive: true
    };

    return this.currentPoll;
  }

  /**
   * Submit a student's answer
   */
  submitAnswer(socketId, answerIndex) {
    if (!this.currentPoll || !this.currentPoll.isActive) {
      throw new Error('No active poll');
    }

    const student = this.students.get(socketId);
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.hasAnswered) {
      throw new Error('Student has already answered');
    }

    if (answerIndex < 0 || answerIndex >= 4) {
      throw new Error('Invalid answer index');
    }

    // Record answer
    student.hasAnswered = true;
    student.answer = answerIndex;
    this.currentPoll.options[answerIndex].votes++;

    // Check if all students have answered
    if (this.areAllStudentsAnswered()) {
      this.endPoll();
    }

    return this.getResults();
  }

  /**
   * End the current poll
   */
  endPoll() {
    if (!this.currentPoll) return;

    this.currentPoll.isActive = false;
    this.currentPoll.endTime = Date.now();

    // Save to history
    this.pollHistory.push({
      ...this.currentPoll,
      participants: Array.from(this.students.values()).map(s => ({
        name: s.name,
        answer: s.answer,
        hasAnswered: s.hasAnswered
      }))
    });

    return this.getResults();
  }

  /**
   * Get current poll results
   */
  getResults() {
    if (!this.currentPoll) return null;

    const totalVotes = this.currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return {
      id: this.currentPoll.id,
      question: this.currentPoll.question,
      options: this.currentPoll.options.map(opt => ({
        text: opt.text,
        index: opt.index,
        votes: opt.votes,
        percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
        isCorrect: opt.isCorrect
      })),
      totalVotes,
      isActive: this.currentPoll.isActive,
      correctAnswer: this.currentPoll.correctAnswer
    };
  }

  /**
   * Check if poll is complete (all students answered or time expired)
   */
  isPollComplete() {
    if (!this.currentPoll) return true;
    return !this.currentPoll.isActive || this.areAllStudentsAnswered();
  }

  /**
   * Check if all students have answered
   */
  areAllStudentsAnswered() {
    if (this.students.size === 0) return false;
    return Array.from(this.students.values()).every(s => s.hasAnswered);
  }

  /**
   * Add a student
   */
  addStudent(socketId, name) {
    if (this.students.has(socketId)) {
      throw new Error('Student already exists');
    }

    // Check for duplicate names
    const existingNames = Array.from(this.students.values()).map(s => s.name.toLowerCase());
    if (existingNames.includes(name.toLowerCase())) {
      throw new Error('Name already taken');
    }

    this.students.set(socketId, {
      name,
      hasAnswered: false,
      answer: null,
      joinedAt: Date.now()
    });

    return this.getStudentsList();
  }

  /**
   * Remove a student
   */
  removeStudent(socketId) {
    const student = this.students.get(socketId);
    this.students.delete(socketId);

    // If student had answered, update vote count
    if (student && student.hasAnswered && this.currentPoll) {
      this.currentPoll.options[student.answer].votes--;
    }

    return this.getStudentsList();
  }

  /**
   * Get list of all students
   */
  getStudentsList() {
    return Array.from(this.students.entries()).map(([socketId, student]) => ({
      socketId,
      name: student.name,
      hasAnswered: student.hasAnswered,
      joinedAt: student.joinedAt
    }));
  }

  /**
   * Get poll history
   */
  getPollHistory() {
    return this.pollHistory.map(poll => ({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      correctAnswer: poll.correctAnswer,
      startTime: poll.startTime,
      endTime: poll.endTime,
      participants: poll.participants
    }));
  }

  /**
   * Get current poll info
   */
  getCurrentPoll() {
    if (!this.currentPoll) return null;

    // Calculate remaining time
    const elapsedTime = Math.floor((Date.now() - this.currentPoll.startTime) / 1000);
    const remainingTime = Math.max(0, this.currentPoll.timeLimit - elapsedTime);

    return {
      id: this.currentPoll.id,
      question: this.currentPoll.question,
      options: this.currentPoll.options.map(opt => opt.text),
      timeLimit: this.currentPoll.timeLimit,
      remainingTime: remainingTime,
      startTime: this.currentPoll.startTime,
      isActive: this.currentPoll.isActive
    };
  }

  /**
   * Check if student exists
   */
  hasStudent(socketId) {
    return this.students.has(socketId);
  }

  /**
   * Get student info
   */
  getStudent(socketId) {
    return this.students.get(socketId);
  }
}

export default PollManager;
