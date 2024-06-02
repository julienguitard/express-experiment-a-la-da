import { EjsView, UbiquitousConcept, ejsViewsProps } from 'types';


const ejsViewsPropsKeys: Record<EjsView, Array<UbiquitousConcept>> =
{
    'Index': ['startTime'],
    'Signin': ['startTime'],
    'Signup': ['startTime'],
    'UserHome': ['startTime', 'userName'],
    'ArtistHome': ['startTime', 'userName'],
    'Ban': ['startTime', 'userName'],
    'Unlike': ['startTime', 'userName', 'workName'],
    'Withdraw': ['startTime', 'userName', 'workName'],
    'Artist': ['startTime', 'userName'],
    'User': ['startTime', 'userName'],
    'Work': ['startTime', 'userName'],
    'MoreArtist': ['startTime', 'userName'],
    'MoreUser': ['startTime', 'userName'],
    'MoreWork': ['startTime', 'userName'],
    'Logout': ['startTime', 'userName'],
    'Delete': ['startTime', 'userName'],
    'Error': ['startTime', 'userName']
};

export {ejsViewsPropsKeys};