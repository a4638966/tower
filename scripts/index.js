var Index = function () {
    this._urls = {};
    this._controls = {
        userMin: $('#userMin'),
        btnLogin: $('#btnLogin'),
        loginAgo: $('#loginAgo'),
        loginAfter: $('#loginAfter'),
        btnLoginOut: $('#btnLoginOut')
    };
};

Index.prototype.initControl = function () {
    var that = this;
    // 初始化layui
    layui.use(['carousel', 'form', 'element'], function () {
        var carousel = layui.carousel;
        var form = layui.form;
        var element = layui.element;
        //建造实例
        carousel.render({
            elem: '#myCarousel',
            width: '100%' //设置容器宽度
                ,
            height: '348px',
            arrow: 'hover' //始终显示箭头
            //,anim: 'updown' //切换动画方式
        });
        // 按钮事件
        that._controls.btnLogin.on('click', function () {
            layer.msg('登陆成功，欢迎您薛总', {
                icon: 1,
                time: 700 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                that._controls.loginAgo.hide();
                that._controls.loginAfter.show();
                that._controls.userMin.show();
            });
        });
        that._controls.btnLoginOut.on('click', function () {
            layer.confirm('确认退出当前账户？', {
                icon: 3,
                title: '提示'
            }, function (index) {
                layer.close(index);
                layer.msg('退出成功', {
                    icon: 1,
                    time: 500 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    that._controls.loginAgo.show();
                    that._controls.loginAfter.hide();
                    that._controls.userMin.hide();
                });

            });
        });
    });
    // 初始化chart图表
    // 调用charts.js
    var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
    var pieChart = new Chart(pieChartCanvas)
    var PieData = [{
            value: 700,
            color: '#0070C9',
            highlight: '#0070C9',
            label: '业务类型1'
        },
        {
            value: 200,
            color: '#7fb7e4',
            highlight: '#7fb7e4',
            label: '业务类型2'
        },
        {
            value: 500,
            color: '#e8e9ea',
            highlight: '#e8e9ea',
            label: '业务类型3'
        }
    ]
    var pieOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: '#fff',
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: 'easeOutBounce',
        animateRotate: true,
        animateScale: false,
        responsive: false,
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
    }
    pieChart.Doughnut(PieData, pieOptions);

    // 切换效果
    var dataInfo = '';
    $('.energy-tip p').on('click', function () {
        $(this).children('.energy-block').addClass('active')
        $(this).siblings().children('.energy-block').removeClass('active');

        dataInfo = $(this).children('.energy-text').attr('dataInfo');
        console.log(dataInfo)
        switch (dataInfo) {
            case 'beidian':
                $('#number').html('18');
                $('#income').html('0');
                $('#dapacity').html('0.27');
                break;
            case 'fadian':
                $('#number').html('2');
                $('#income').html('0');
                $('#dapacity').html('0.17');
                break;
            case 'huandian':
                $('#number').html('0');
                $('#income').html('0');
                $('#dapacity').html('0');
                break;
            case 'shoudian':
                $('#number').html('2');
                $('#income').html('0');
                $('#dapacity').html('0');
                break;
            case 'jinrong':
                $('#jinrongInfo').show().siblings('.customer-box').hide();
                break;
            case 'yiliao':
                
                $('#yiliaoInfo').show().siblings('.customer-box').hide();
                break;
            case 'gongan':
                $('#gonganInfo').show().siblings('.customer-box').hide();
                break;
            case 'xuexiao':
                $('#xuexiaoInfo').show().siblings('.customer-box').hide();
                break;
            case 'danwei':
                $('#danweiInfo').show().siblings('.customer-box').hide();
                break;
            case 'shuju':
                $('#shujuInfo').show().siblings('.customer-box').hide();
                break;
            case 'wuye':
                $('#wuyeInfo').show().siblings('.customer-box').hide();
                break;
        }
    });

    // this.initUpdate();
}

// 初始化日期
Index.prototype.initUpdate = function () {
    var that = this;
  
    function add(m) {
      return m < 10 ? '0' + m : m
    }
  
    function fortime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var mm = date.getMinutes();
      var s = date.getSeconds();
      return (y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s));
    }
  
    var date = new Date(new Date().getTime());// + (1000 * 60 * 60 * 72));
    var date_str = fortime(date);
    $('.news-date').html(date_str)
  };