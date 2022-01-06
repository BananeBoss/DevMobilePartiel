import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import ActorlistItem from '../components/ActorListItem';
import DisplayError from '../components/DisplayError';

import Colors from '../definitions/Colors';

import { getActors } from '../api/theMovieDB';

const Search = ({ navigation, favActors }) => {

    const [actors, setActors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextOffset, setNextOffset] = useState(0);
    const [isMoreResults, setIsMoreResults] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);

    const requestActors = async () => {
        setIsRefreshing(true);
        setIsError(false);
        try {
            const theMovieDBSearchResult = await getActors();
            setActors(theMovieDBSearchResult.results);
        } catch (error) {
            setIsError(true);
            setActors([]);
        }
        setIsRefreshing(false);
    };

    const searchActors = () => {
        Keyboard.dismiss();
        requestActors([], 0);
    };

    const loadMoreActors = () => {
        if (isMoreResults) {
            requestActors(actors, nextOffset);
        };
    };

    const navigateToActorDetails = (actorsID) => {
        navigation.navigate("ViewActor", { actorsID });
    };

    const amIaFavActor = (actorsID) => {
        if (favActors.findIndex(i => i === actorsID) !== -1) {
            return true;
        }
        return false;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Nom de l'acteur"
                    style={styles.inputActorName}
                    onChangeText={(text) => setSearchTerm(text)}
                    onSubmitEditing={searchActors}
                />
                <Button
                    title='Rechercher'
                    color={Colors.mainGreen}
                    onPress={searchActors}
                />
            </View>
            {
                isError ?
                    (<DisplayError message='Impossible de récupérer les acteurs' />) :
                    (<FlatList
                        data={actors}
                        extraData={favActors}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ActorlistItem
                                actorData={item}
                                onClick={navigateToActorDetails}
                                isFav={amIaFavActor(item.id)} />
                        )}
                        onEndReached={loadMoreActors}
                        onEndReachedThreshold={0.5}
                        refreshing={isRefreshing}
                        onRefresh={searchActors}
                    />)
            }
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        favActors: state.favActorsID
    }
}

export default connect(mapStateToProps)(Search);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        marginTop: 16,
    },
    searchContainer: {
        marginBottom: 16,
    },
    inputActorName: {
        marginBottom: 8,
    },
});