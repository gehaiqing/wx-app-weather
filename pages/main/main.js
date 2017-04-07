var app = getApp();

var WeatherService = require('../../utils/WeatherService');
var demoData = require('../../utils/data');
var wxCharts = require('../../libs/wxcharts.js');
var lineChart = null;

Page({
  data: {
    locInfo: {},
    info: {},
    weekImgs: []
  },
  onShareAppMessage: function () {
    return {
      title: this.data.info.cityInfo.c3 + '天气',
      path: '/pages/index/index'
    }
  },
  onLoad: function () {
    var _this = this
    this.setData({
      info: app.globalData.info,
    })
    wx.setNavigationBarTitle({
      title: this.data.info.cityInfo.c3 + '天气'
    })

    this.genChart(this.data.info);

  },
  chartTouchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },
  genChart: function (data) {
    let dayDataArr = [];
    let nightDataArr = [];
    let weekData = [];
    let weekImgs = [];
    for (let i = 1; i < 8; i++) {
      dayDataArr.push(data['f' + i].day_air_temperature);
      nightDataArr.push(data['f' + i].night_air_temperature);
      weekData.push(this.numToCn(data['f' + i].weekday));
      weekImgs.push(data['f' + i].day_weather_pic);
    }

    this.setData({
      weekImgs: weekImgs
    })

    console.dir(weekImgs);

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: weekData,
      animation: false,
      background: '#00000000',
      legend: false,
      series: [{
        name:'夜晚',
        data: nightDataArr,
        format: function (val, name) {
          return val + '°';
        }
      }, {
        name:'白天',
        data: dayDataArr,
        format: function (val, name) {
          return val + '°';
        },

      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        disabled: true
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  numToCn: function (num) {
    var week = ['', '一', '二', '三', '四', '五', '六', '日'];
    if (num < 1)
      num = 1;
    if (num > 7)
      num = 7;
    return '周' + week[num];
  }
})