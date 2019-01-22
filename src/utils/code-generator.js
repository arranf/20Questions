class GenerateCode {
  constructor(codeLength, codeLetterChoices) {
    const CODE_LENGTH = 7;
    const CODE_LETTER_CHOICES = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
      'N', 'O', 'P', 'Q' , 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ];

    this.codeLength = codeLength || CODE_LENGTH;
    this.codeLetterChoices = codeLetterChoices || CODE_LETTER_CHOICES;
    function factorial (n) {
      if (n < 1) {
        return 1;
      }
      
      return n * factorial(n - 1);
    }

    this.permutations = factorial(this.codeLetterChoices.length) / factorial(this.codeLetterChoices.length - this.codeLength); 
  }

  generate () {
    let code = '';
    for (let i = 0; i < this.codeLength; i++) {
      code += this.codeLetterChoices[(Math.floor(Math.random() * this.codeLetterChoices.length)) ]; 
    }
    return code;
  }
}

module.exports = GenerateCode;