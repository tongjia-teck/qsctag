// 
var QSCtagBox = {
    container:null,                             // 添加标签的容器
    ary_added_tags: null,                       // 后添加的标签值
    ary_all_tags:Array(),                       // 控件中的所有标签
    selected_tags:Array(),                      // 控件中选中的标签
    current_tag:null,                           // 当前选中的标签
    tag_call_back_type:0,                       // 设置tag call back的类型 
                                                //     0 所有标签回调， 
                                                //     1 只回调后添加的标签
    onTagSelect:function(){},                   // tag选中后事件回调
    onTagSelectCancel:function(){},             // tag取消选中后事件回调
    onAddedTagSelect:function(control,e) {      // 后添加的标签选中后的事件回调 
        this.current_tag = control.html()  ;
        this.onTagSelect(this.current_tag) ;
        return control;
    } ,

    onAddedTagSelectCancel:function(control,e) { // 后添加的标签取消选中后的事件回调 
        this.current_tag = control.html()  ;
        this.onTagSelect(this.current_tag) ;
        return control;
    } ,

    get_added_tags:function(){                  // 获取所有标签
        return this.selected_tags ;
    },

    add_tag:function(tag_name){                 // 添加一个标签
        if(this.ary_added_tags == null) {
            this.ary_added_tags = Array() ;
        }

        // this.ary_added_tags.push(tag_name) ;
        this.add_tag_item(tag_name) ;
    },

    <!--内部方法实现-->
    funClickTag:function(control,e) {                   
        // console.log('funClickTag') ;
        var className = control.attr('class') ; 
        // 选中状态->非选中
        if(className != null && className != '' && className.indexOf('tag_selected') >= 0) {
            this.onTagSelectCancel(control.html()) ;
            control.removeClass('tag_selected') ; 
            this.selected_tags.remove(control.html()) ;
        } else { // 非状态 -> 选中
            this.onTagSelect(control.html()) ;
            control.addClass('tag_selected') ;
            this.selected_tags.push(control.html()) ;
        }
        return this;
    },

    funClickAddedTag:function(control,e) {
        var className = control.attr('class') ; 
        // 选中状态
        if(className != null && className != '' && className.indexOf('tag_selected') >= 0) {
            this.onAddedTagSelect(control.html()) ;
            control.removeClass('tag_selected') ; 
            this.selected_tags.remove(control.html()) ;
        } else { // 移出状态
            this.onAddedTagSelectCancel(control.html()) ;
            control.addClass('tag_selected') ; 
            this.selected_tags.push(control.html()) ;
        }

        return this;
    },
    add_tag_item:function(tag_name) {
        if(tag_name == null || tag_name == '') {
            return ;
        }
        if(this.tag_is_exist(tag_name, this.ary_all_tags)) {
           return ;
        }

        this.ary_all_tags.push(tag_name) ;
        this.ary_added_tags.push(tag_name) ;
        var li = document.createElement('li') ;
        li.innerHTML = tag_name ;
        if(this.tag_call_back_type == 1 && this.onAddTagSelect != null) {
            li.addEventListener(
                "click", 
                function(e) {
                    QSCtagBox.funClickAddedTag($(this),e); 
                },
                false);
        }
        
        this.container.append(li) ;
    } ,
    tag_is_exist:function(tag_name, ary) {
        if(ary == null) {
            return false ;
        }
        for (var i = ary.length - 1; i >= 0; i--) {
            if(tag_name == ary[i]) {
                return true ;
            }
        }
        return false ;
    } ,
    init:function() {
        if(this.container != null && this.container.children() != null && this.container.children.length > 0) {
            children_len = this.container.children().length ;
            for (var i = 0; i < children_len; i++) {
                var value = this.container.children().get(i).innerHTML ;
                if(!this.tag_is_exist(value, this.ary_all_tags)) {
                    this.ary_all_tags.push(value) ;
                }
            };
        }

        // 所有标签都回调，默认所有回调
        if(this.tag_call_back_type == 0) {
            this.container.delegate(
                "li",
                "click",
                function(e) {
                    QSCtagBox.funClickTag($(this),e) ;
                    return $(this) ;
                }) ;
        }
        
        // 后添加的标签不为空，则初始化时添加进来
        if(this.ary_added_tags != null) {  
            for (var i = 0; i < this.ary_added_tags.length; i++) {
                this.add_tag_item(this.ary_added_tags[i]) ;
            }
        }
    }
};

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};