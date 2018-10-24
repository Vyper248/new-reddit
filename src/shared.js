import Moment from 'moment';

const Shared = {
    getTimeString: (milliseconds) => {
        //create a string showing how long ago this was posted.
        //could use Moment.fromNow(), but I prefer a more accurate time
        let created = Moment(milliseconds);
        let today = Moment();
        let difference = Moment.duration(today.diff(created));

        let dateString;
        if (difference.years() === 1) dateString = difference.years() + ' year ago';
        else if (difference.years() > 1) dateString = difference.years() + ' years ago';
        else if (difference.months() === 1) dateString = difference.months() + ' month ago';
        else if (difference.months() > 1) dateString = difference.months() + ' months ago';
        else if (difference.days() === 1) dateString = difference.days() + ' day ago';
        else if (difference.days() > 1) dateString = difference.days() + ' days ago';
        else if (difference.hours() === 1) dateString = difference.hours() + ' hour ago';
        else if (difference.hours() > 1) dateString = difference.hours() + ' hours ago';
        else if (difference.minutes() === 1) dateString = difference.minutes() + ' minute ago';
        else if (difference.minutes() > 1) dateString = difference.minutes() + ' minutes ago';
        else dateString = 'Now';
        
        return dateString;
    },
};

export default Shared;