Date.prototype.formattedString = function() {
  const monthString = (this.getMonth() + 1) < 10 ? "0" + (this.getMonth() + 1).toString() : (this.getMonth() + 1).toString();
  const dateString = this.getDate() < 10 ? "0" + this.getDate().toString() : this.getDate().toString();

  return [this.getFullYear().toString(), monthString, dateString].join("-");
};

var app = new Vue({
  el: '#app',
  data: {
    name: location.search.match(/[\?&]name=([^&]+)/) ? RegExp.$1 : "",
    date: location.search.match(/[\?&]date=([^&]+)/) ? new Date(RegExp.$1) : new Date()
  },
  methods: {
    sunday: function() {
      return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - this.date.getDay());
    },
    prevSunday: function() {
      return new Date(this.sunday().getFullYear(), this.sunday().getMonth(), this.sunday().getDate() - 7);
    },
    nextSunday: function() {
      return new Date(this.sunday().getFullYear(), this.sunday().getMonth(), this.sunday().getDate() + 7);
    },
    monday: function() {
      return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - this.date.getDay() + 1);
    },
    weekNumber: function() {
      const d = this.monday();
      const dayNum = d.getDay() || 7;
      d.setDate(d.getDate() + 4 - dayNum);
      const thisYear = d.getFullYear();
      const yearStart = new Date(thisYear, 0, 1);

      return thisYear.toString() + "-WN" + Math.ceil((((d - yearStart) / 86400000) + 1) / 7).toString();
    },
    weekDays: function() {
      const year = this.monday().getFullYear();
      const month = this.monday().getMonth();
      const date = this.monday().getDate();

      const sun = new Date(year, month, date - 1);
      const mon = new Date(year, month, date + 0);
      const tue = new Date(year, month, date + 1);
      const wed = new Date(year, month, date + 2);
      const thu = new Date(year, month, date + 3);
      const fri = new Date(year, month, date + 4);
      const sat = new Date(year, month, date + 5);

      return [sun, mon, tue, wed, thu, fri, sat];
    },
    pageTitle: function(startDayString, name) {
      return "Weekly " + name + " (" + startDayString + "〜)";
    },
    template: function() {
      let result = "";

      result += this.pageTitle(this.sunday().formattedString(), this.name) + "\n";
      result += "#weekly_report #" + this.weekNumber() + "\n\n";

      result += "[*** ナビゲーション]\n\n";
      result += " 前週 → [" + this.pageTitle(this.prevSunday().formattedString(), this.name) + "]\n";
      result += " 次週 → [" + this.pageTitle(this.nextSunday().formattedString(), this.name) + "]\n\n";

      result += "[*** 今週のやっていき]\n\n";

      this.weekDays().reverse().forEach(function(weekDay) {
        const dayOfTheWeekString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekDay.getDay()];

        result += "[hr.icon]\n\n"
        result += "[*** " + weekDay.formattedString() + " " + dayOfTheWeekString + "]\n\n";
        result += "[** お気持ち]\n\n";
        result += "[** やること]\n\n";
      });

      return result;
    }
  }
})
