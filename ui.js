var canvas, ctx;
var WIDTH, HEIGHT, HALFWIDTH, HALFHEIGHT;

var pi = Math.PI;

var doStroke = true;

var schedule;

var InputFlags = {
    "click": false,
    "mouseX": 0,
    "mouseY": 1e6
};

class Schedule {
    
    constructor(schedule) {
        this.classes = schedule.classes;
        this.teachers = schedule.teachers;
        this.students = schedule.students;
        this.colorBySubject = { // R    G    B
            "goal time":        [255, 255, 140],
            "studio":           [137, 255, 245],
            "math":             [216, 255, 127],
            "science":          [183, 205, 255],
            "history":          [255, 206, 109],
            "english":          [175, 255, 189],
            "computer science": [255, 195, 186],
            "art":              [178, 255, 215],
            "world language":   [255, 206, 248],
            "outer wellness":   [220, 220, 220]
        };
        this.teacherBySubject = {
            "goal time":        [undefined],
            "studio":           ["John", "Tristen"],
            "math":             ["Marcy"],
            "science":          ["Megan", "Denise"],
            "history":          ["Derek"],
            "english":          ["Brett"],
            "computer science": ["Denise"],
            "art":              ["Saloni"],
            "world language":   ["Raquel", "Sara", "Sabrina"],
            "outer wellness":   ["Devin"]

        };
    }

    getBlock(block) {
        var times = ["9:15 - 10:00", "10:00 - 10:45", "11:00 - 11:45", "11:45 - 12:30", "1:15 - 2:00", "2:00 - 2:45", "2:45 - 3:45"];
        return times[block];
    }

    getDay(day) {
        var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        return days[day];
    }

    getColor(classId) {
        var teacher, i;
        for (i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].classes.indexOf(classId) != -1) {
                teacher = this.teachers[i].name;
                break;
            }
        }

        var keys = Object.keys(this.teacherBySubject);
        for (i = 0; i < keys.length; i++) {
            if (this.teacherBySubject[keys[i]].indexOf(teacher) != -1)
                return this.colorBySubject[keys[i]];
        }
        throw "Error: invalid classId in Schedule.getColor";
    }

    getPerson(type, name) {
        var list, i;
        if (type == "teacher")
            list = this.teachers;
        else if (type == "student")
            list = this.students;
        else
            throw "Error: invalid type provided in Schedule.getPerson";

        for (i = 0; i < list.length; i++)
            if (list[i].name == name)
                return list[i];
        throw "Error: invalid name provided in Schedule.getPerson";
    }

    getClass(person, day, block) {
        // Returns the class the student is in at a given day and block.
        // The default is that the student has goal time.
        // The return is a dictionary with the class name, which may be modified
        // to continued or goal time, and the class id, which is constant.
        var slot = 7*day + block + 1, classHolder, i, j;
        for (i = 0; i < person.classes.length; i++) {
            classHolder = this.classes[person.classes[i]];
            if (slot == classHolder.value)
                return {"name": classHolder.name, "id": person.classes[i]}; 
            else if (slot > classHolder.value && slot < classHolder.value + classHolder.duration)
                return {"name": classHolder.name + " [cont]", "id": person.classes[i]};
        }
        return {"name": "Goal Time", "id": person.classes[i]};
    }

    display(type, name) {
        var days = 5, blocks = 7, person = this.getPerson(type, name),
            classData, color = [0, 0, 0], i, j;
        fill(200, 200, 200);
        noStroke();
        rect(0, 0, WIDTH, HEIGHT);
        stroke(0, 0, 0);
        fill(0, 0, 0);
        for (i = 0; i < days + 1; i++) {
            for (j = 0; j < blocks + 1; j++) {
                if (i == 0 && j == 0)
                    continue;
                else if (i == 0 && j != 0) {
                    textSize(HEIGHT / 60);
                    text(this.getBlock(j - 1), WIDTH*(-1/2 + 1/(blocks + 1)),
                        HEIGHT*(-1/3 + 5/6 * j/(blocks + 1))); 
                }
                else if (j == 0 && i != 0) {
                    textSize(HEIGHT / 40);
                    text(this.getDay(i - 1), WIDTH*(-1/2 + (i + 1)/(blocks + 1)),
                        HEIGHT*(-3/10 - 1/(6 * (blocks + 1))));
                }
                else {
                    classData = this.getClass(person, i - 1, j - 1);
                    color = this.getColor(classData.id);
                    fill(color[0], color[1], color[2]);
                    rect(WIDTH*(-1/2 + (i + 1)/(blocks + 1)),
                        HEIGHT*(-1/3 + 5/6 * j/(blocks + 1)),
                        WIDTH/(blocks + 1), 5/6 * HEIGHT/(blocks + 1));
                    fill(0, 0, 0);
                    textWrap(classData.name, WIDTH*(-1/2 + (i + 1)/(blocks + 1)),
                        HEIGHT*(-1/3 + 5/6 * j/(blocks + 1) - 0.1/(blocks + 1)),
                        WIDTH/(blocks + 1), HEIGHT/50);
                }
            }
        }
    }

}

// New context fuctions here.
function fill(red, green, blue, alpha) {
  if (alpha === undefined) {
    alpha = 1;
  }
  ctx.fillStyle = "rgba("+Math.floor(red)+","+Math.floor(green)+","+Math.floor(blue)+","+alpha+")";
}
function noStroke() {
  doStroke = false;
}
function stroke(red, green, blue) {
  ctx.strokeStyle = "rgb("+Math.floor(red)+","+Math.floor(green)+","+Math.floor(blue)+")";
  doStroke = true;
}
function strokeWeight(weight) {
  ctx.lineWidth = weight;
  doStroke = true;
}
function rect(x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x - width/2, y - height/2, width, height);
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function ellipse(x, y, xRadius, yRadius) {
  ctx.beginPath();
  ctx.ellipse(x, y, xRadius, yRadius, 0, 0, 2*pi);
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}
function textSize(size) {
  ctx.font = size + "px Arial";
}
function text(str, x, y, alignment) {
  if (alignment === undefined) {
    alignment = "center";
  }
  ctx.textAlign = alignment;
  ctx.fillText(str, x, y);
}
function textWrap(str, x, y, width, fontSize) {
  // Idea adapted from https://codepen.io/ashblue/pen/fGkma?editors=0010
  
  var lines = [],
      line = "",
      lineTest = "",
      words = str.split(" "),
      currentY = y;
  
  textSize(fontSize);
  
  for (var i = 0, len = words.length; i < len; i++) {
    lineTest = line + words[i] + " ";
    
    if (ctx.measureText(lineTest).width < width) {
      line = lineTest;
    }
    else {
      currentY += fontSize;
      
      lines.push({"text": line, "currentY": currentY});
      line = words[i] + " ";
    }
  }
  
  // Catch last line in-case something is left over
  if (line.length > 0) {
    currentY += fontSize;
    lines.push({ "text": line.trim(), "currentY": currentY });
  }
  
  for (var i = 0, len = lines.length; i < len; i++) {
    text(lines[i]["text"], x, lines[i]["currentY"]);
  }
}

function resize() {
  ctx.translate(-HALFWIDTH, -HALFHEIGHT);
  
  canvas.width = 4/5 * window.innerWidth;
  canvas.height = canvas.width;
  if (canvas.height > 7/8 * window.innerHeight) {
    // If the height is greater than the height of the screen, set it accordingly.
    canvas.height = 7/8 * window.innerHeight;
    canvas.width = canvas.height;
  }
  
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  HALFWIDTH = WIDTH / 2;
  HALFHEIGHT = HEIGHT / 2;
  
  ctx.translate(HALFWIDTH, HALFHEIGHT);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    var body = document.getElementsByTagName("body")[0];
    body.onresize = resize;
    resize();

    canvas.onmouseup = function(e) {
        InputFlags["click"] = true;
    };
    document.onmousemove = function(e) {
        var x = e.clientX - window.innerWidth/2;

        var canvas = document.getElementById("canvas"); 
        var offset = canvas.getBoundingClientRect().top + window.scrollY;
        var y = e.clientY - HALFHEIGHT + offset;
        InputFlags["mouseX"] = x;
        InputFlags["mouseY"] = y;
    };
}

function loadJSON(json) {
    init();

    try {
        var parsed = JSON.parse(json);
    }
    catch {
        throw "Error: invalid JSON";
        return;
    }

    schedule = new Schedule(parsed); 
    schedule.display("student", "LAKER NEWHOUSE");
}
