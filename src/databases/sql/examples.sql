
SELECT *
FROM generate_user ('bc4c3ea077d95736a64b34a222c6eb0e','1715750000','ju','pwd');

SELECT *
FROM generate_user ('58a9fce14954d73241cce675d68d378a','1715751000','jo','pwd');

SELECT *
FROM generate_user ('69d8c607e3aebfc7dfca444df0cce5b6','1715752000','jake','pwd');

SELECT *
FROM generate_user_event ('58a9fce14954d73241cce675d68d378a','1715753000','delete');

SELECT *
FROM generate_user ('455bb199857541d35e424cef5a5f5f4b','1715754000','gil','pwd');

SELECT *
FROM generate_user ('a6772d17a88788fc111d1e2637977401','1715754500','kyle','pwd');

SELECT *
FROM generate_artist ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715755000');

SELECT *
FROM generate_artist ('61d6184592315a39b8f8bb9553700436','a6772d17a88788fc111d1e2637977401','1715755500');

SELECT *
FROM generate_artist_event ('1e0bb3ab006e8f93efdfc385c1e13722','1715756000','be');

SELECT *
FROM generate_work ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715757000','first_draft');

SELECT *
FROM generate_work ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715758000','second_draft');

SELECT *
FROM generate_work ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715759000','good_version');

SELECT *
FROM generate_work ('aad8a727b09600707339c4a4531208b8','61d6184592315a39b8f8bb9553700436','1715759500','experiment');

SELECT *
FROM generate_work_event ('2f0ae6871c0924a605169ad43fcf15a5','1715760000','withdraw');

SELECT *
FROM generate_user_artist ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715761000');

SELECT *
FROM generate_user_artist_event ('095a719c0b977dafed9eff3e5efdfc54','1715762000','watch');

SELECT *
FROM generate_user_artist_event ('095a719c0b977dafed9eff3e5efdfc54','1715763000','unwatch');

SELECT *
FROM generate_user_artist ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715764000');

SELECT *
FROM generate_user_artist_event ('7cfda70b457f9b97f79c54e36388d6a2','1715765000','watch');

SELECT *
FROM generate_user_work ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715766000');

SELECT *
FROM generate_user_work_event ('290203d452028cf5e3f36a708bb2279b','1715767000','view');

SELECT *
FROM generate_user_work_event ('290203d452028cf5e3f36a708bb2279b','1715768000','like');

SELECT *
FROM insert_user ('bc4c3ea077d95736a64b34a222c6eb0e','1715750000','ju','pwd');

SELECT *
FROM insert_user ('58a9fce14954d73241cce675d68d378a','1715751000','jo','pwd');

SELECT *
FROM insert_user ('69d8c607e3aebfc7dfca444df0cce5b6','1715752000','jake','pwd');

SELECT *
FROM insert_user_event ('58a9fce14954d73241cce675d68d378a','1715753000','delete');

SELECT *
FROM insert_user ('455bb199857541d35e424cef5a5f5f4b','1715754000','gil','pwd');

SELECT *
FROM insert_user ('a6772d17a88788fc111d1e2637977401','1715754500','kyle','pwd');

SELECT *
FROM insert_artist ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715755000');

SELECT *
FROM insert_artist ('61d6184592315a39b8f8bb9553700436','a6772d17a88788fc111d1e2637977401','1715755500');

SELECT *
FROM insert_artist_event ('1e0bb3ab006e8f93efdfc385c1e13722','1715756000','be');

SELECT *
FROM insert_work ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715757000','first_draft');

SELECT *
FROM insert_work ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715758000','second_draft');

SELECT *
FROM insert_work ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715759000','good_version');

SELECT *
FROM insert_work ('aad8a727b09600707339c4a4531208b8','61d6184592315a39b8f8bb9553700436','1715759500','experiment');

SELECT *
FROM insert_work_event ('2f0ae6871c0924a605169ad43fcf15a5','1715760000','withdraw');


SELECT *
FROM insert_user_artist ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715761000');

SELECT *
FROM insert_user_artist_event ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715762000','watch');

SELECT *
FROM insert_user_artist_event ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715763000','unwatch');

SELECT *
FROM insert_user_artist ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715764000');

SELECT *
FROM insert_user_artist_event ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715765000','watch');

SELECT *
FROM insert_user_work ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715766000');

SELECT *
FROM insert_user_work_event ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715767000','view');

SELECT *
FROM insert_user_work_event ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715768000','like');
