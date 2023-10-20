export const errorCodes = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    description: 'Bad Request! Please use correct payload.',
  },

  PLAYER_NOT_FOUND: {
    code: 'PLAYER_NOT_FOUND',
    description: "Player doesn't exist!",
  },

  COUPON_NOT_FOUND: {
    code: 'COUPON_NOT_FOUND',
    description: "Coupon doesn't exist!",
  },

  REWARD_EXPIRED: {
    code: 'REWARD_EXPIRED',
    description: 'The reward campaign has ended!',
  },

  COUPON_ALREADY_USED: {
    code: 'COUPON_ALREADY_USED',
    description: 'Coupon had been already redeemed!',
  },

  DAILY_LIMIT_REACHED: {
    code: 'DAILY_LIMIT_REACHED',
    description:
      'You have reached the max redeem limit for today. Please try again tomorrow!',
  },

  TOTAL_LIMIT_REACHED: {
    code: 'TOTAL_LIMIT_REACHED',
    description: 'You have reached the total redeem limit!',
  },
};
