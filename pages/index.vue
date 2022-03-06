<template>
  <form class="DonationCard" @submit.prevent="sendDonate()">
    <div class="DonationCard__buttons">
      <variable
        v-for="(item, index) in presets"
        :key="index"
        v-slot="{ sum }"
        :sum="computeValue(item)"
      >
        <button
          type="button"
          :class="{ DonationCard__buttons_active: suggestion == sum }"
          @click="dirtySuggestion = suggestion = sum"
        >
          {{ currency.symbol }} {{ sum | toLocaleString(currency.code) }}
        </button>
      </variable>
    </div>
    <div class="DonationCard__selectWrapper">
      <span class="DonationCard__currency">{{ currency.symbol }}</span>
      <input
        :value="suggestion"
        class="DonationCard__input"
        type="text"
        @input="convertToNaturalNumber($event)"
      />
      <select
        v-model="currency"
        class="DonationCard__select"
        type="text"
        @focus="focused = true"
        @focusout="focused = false"
      >
        <option v-for="(item, index) in currencies" :key="index" :value="item">
          {{ item.code }}
        </option>
      </select>
    </div>
    <button class="DonationCard__submit">Donate</button>
  </form>
</template>

<script>
export default {
  filters: {
    toLocaleString(value) {
      return value.toLocaleString('en-US')
    },
  },
  data() {
    return {
      currency: { name: 'US Dollar', code: 'USD', symbol: '$', rate: 1 },
      currencies: [
        { name: 'US Dollar', code: 'USD', symbol: '$', rate: 1 },
        { name: 'Euro', code: 'EUR', symbol: '€', rate: 0.897597 },
        { name: 'British Pound', code: 'GBP', symbol: '£', rate: 0.81755 },
        { name: 'Russian Ruble', code: 'RUB', symbol: '₽', rate: 63.461993 },
      ],
      suggestion: 40,
      dirtySuggestion: 40, // for correct convert when currency changed
      presets: [40, 100, 200, 1000, 2500, 5000],
      focused: false,
    }
  },
  watch: {
    currency(value, oldValue) {
      // if currency changed convert the sum
      this.dirtySuggestion = (this.dirtySuggestion / oldValue.rate) * value.rate
      this.suggestion = this.convertToNiceNumber(this.dirtySuggestion)
    },
  },
  methods: {
    convertToNiceNumber(value) {
      const roundedValue = Math.round(value)
      const stringValue = roundedValue.toString()
      const numberDigit = +`1${'0'.repeat(stringValue.length - 1)}` // convert number to number digit 1 -> 10, 2-> 100
      if (stringValue.length <= 3) {
        return Math.round(roundedValue / 10) * 10
      } else if (stringValue.length === 4) {
        return Math.round(roundedValue / 100) * 100
      } else {
        return Math.round(roundedValue / numberDigit) * numberDigit
      }
    },
    convertToNaturalNumber(value) {
      this.dirtySuggestion = this.suggestion = value.target.value.replace(
        /[^0-9]/g,
        ''
      )

      this.$forceUpdate()
    },
    computeValue(value) {
      return this.convertToNiceNumber(value * this.currency.rate)
    },
    sendDonate() {
      this.$axios
        .$post('http://localhost:8080/donate', {
          amount: this.suggestion,
          currency: this.currency.code,
        })
        .then((data) => {
          alert('Thank you for your donation!')
        })
        .catch((err) => {
          alert(err.response?.data?.error || err)
        })
    },
  },
}
</script>

<style lang="scss">
$blue: #628fe4;
.DonationCard {
  font-family: 'Lato', sans-serif;
  max-width: 350px;
  background-color: #f5f5f5;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
  padding: 30px 30px 20px 30px;

  button,
  input[type='submit'] {
    font-size: 1.1em;
    padding: 10px;
    border: none;
    color: #515151;
    border-radius: 10px;
    background: #eeeeee;
    box-shadow: none;
    box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    &.DonationCard__buttons_active {
      background-color: $blue;
      color: #fff;
      box-shadow: unset;
    }
  }
  .DonationCard__buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    margin-bottom: 25px;
    & > button {
      font-size: 1.1em;
      padding: 10px;
      border: none;
      color: #515151;
      border-radius: 10px;
      background: #eeeeee;
      box-shadow: none;
      box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      &.DonationCard__buttons_active {
        background-color: $blue;
        color: #fff;
        box-shadow: unset;
      }
    }
  }
  .DonationCard__selectWrapper {
    margin-bottom: 35px;
    position: relative;
    .DonationCard__currency {
      position: absolute;
      display: flex;
      align-items: center;
      left: 12px;
      font-size: 25px;
      height: 100%;
    }
    .DonationCard__select {
      position: absolute;
      right: 0px;
      top: 0;
      width: 60px;
      border: none;
      background: transparent;
      height: 100%;
    }
    .DonationCard__input {
      width: 100%;
      height: 50px;
      padding-left: 30px;
      box-sizing: border-box;
      font-size: 2.2em;
      color: #628fe4;
    }
  }
  .DonationCard__submit {
    width: 100%;
    height: 56px;
    background-color: $blue;
    color: #fff;
    text-transform: uppercase;
  }
}
</style>
