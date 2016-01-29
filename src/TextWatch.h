// Make watch switch time every 5 seconds
#define DEBUG 0

// Data keys
#define KEY_INVERSE 0
#define KEY_BACKGROUND 1
#define KEY_REGULAR_TEXT 2
#define KEY_BOLD_TEXT 3
#define KEY_LANGUAGE 4
#define KEY_OFFSET 5
#define KEY_ALIGNMENT 6

#ifdef PBL_PLATFORM_CHALK
  // Pebble round screen resolution
  #define XRES 180
  #define YRES 180
#else
  // Pebble square screen resolution ;)
  #define XRES 144
  #define YRES 168
#endif

// Max number of characters in a line
#define LINE_LENGTH 7
// How many characters must be available in a line to consider adding a second word
#define LINE_APPEND_MARGIN 2
// We can add a new word to a line if it is no longer than this
#define LINE_APPEND_LIMIT (LINE_LENGTH - LINE_APPEND_MARGIN + 1)

// Max number of lines
#define NUM_LINES 4
// Size of text buffer for lines
#define BUFFER_SIZE (LINE_LENGTH + 2)
// Vertical distance in pixels between lines
#define ROW_HEIGHT 50
// Vertical distance in pixels between lines
#define ROW_OFFSET 37
// Pull top line up by this many pixels
#define TOP_MARGIN 10

// Text alignment. Can be GTextAlignmentLeft, GTextAlignmentCenter or GTextAlignmentRight
#define TEXT_ALIGN GTextAlignmentCenter

// The time it takes for a layer to slide in or out.
#define ANIMATION_DURATION 400
// Delay between the layers animations, from top to bottom
#define ANIMATION_STAGGER_TIME 150
// Delay from the start of the current layer going out until the next layer slides in
#define ANIMATION_OUT_IN_DELAY 100

// How long to show messages, in seconds
#define MESSAGE_DISPLAY_TIME 3

// How long to wait in seconds between connection lost notification and displaying message
#define CONNECTION_LOST_MARGIN 2

// Data structures
typedef struct {
	TextLayer *currentLayer;
	TextLayer *nextLayer;
	char lineStr1[BUFFER_SIZE];
	char lineStr2[BUFFER_SIZE];
	PropertyAnimation *animation1;
	PropertyAnimation *animation2;
} Line;

// Functions
void animationStoppedHandler(struct Animation *animation, bool finished, void *context);
void makeAnimationsForLayer(Line *line, int delay);
void updateLayerText(TextLayer* layer, char* text);
void updateLineTo(Line *line, char *value, int delay);
bool needToUpdateLine(Line *line, char *nextValue);
void configureBoldLayer(TextLayer *textlayer);
void configureLightLayer(TextLayer *textlayer);
int configureLayersForText(char text[NUM_LINES][BUFFER_SIZE], char format[]);
void string_to_lines(char *str, char lines[NUM_LINES][BUFFER_SIZE], char format[]);
void time_to_lines(int hours, int minutes, char lines[NUM_LINES][BUFFER_SIZE], char format[]);
void display_message(char *message, int displayTime);
void display_time(struct tm *t, bool force);
void checkConnection(time_t *now);
void handle_tick(struct tm *tick_time, TimeUnits units_changed);
void init_line(Line* line);
struct tm *get_localtime();
void refresh_time();
void set_offset(int offset);
void inbox_received_handler(DictionaryIterator *iter, void *context);
void notify_bt_lost();
void bt_handler(bool connected);
void readPersistedState();
void handle_init();
void destroy_line(Line* line);
void handle_deinit();
